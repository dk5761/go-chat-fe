import db from "@/services/db";
import { Messages } from "@/services/db/schema";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid";

import NetInfo from "@react-native-community/netinfo";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

export enum MessageStatus {
  PENDING = "pending",
  STORED = "stored",
  SENT = "sent",
  RECEIVED = "received",
  READ = "read",
}

interface Message {
  event_type: string;
  sender_id: string;
  content: string;
  receiver_id: string;
  temp_id: string;
  id?: string;
  message_id?: string; // Assuming messages have an ID for acknowledgment
  created_at?: Date | string;
  delivered?: boolean | null;
  delivered_at?: string | null;
  status: MessageStatus | null;
}

interface WebSocketContextProps {
  messages: Message[];
  setMessages: (data: Message[]) => void;
  sendMessage: (messageData: Message) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{
  serverUrl: string;
  reconnectInterval?: number;
  children: React.ReactNode;
}> = ({ serverUrl, reconnectInterval = 3000, children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const sendPendingMessages = async () => {
    try {
      const pendingMessages = await db
        .select()
        .from(Messages)
        .where(eq(Messages.status, "pending"));

      pendingMessages.forEach((message) => {
        sendMessage(message as Message);
      });
    } catch (error) {
      console.error("Error fetching pending messages:", error);
    }
  };

  const connect = useCallback(() => {
    if (
      !socketRef.current ||
      socketRef.current.readyState === WebSocket.CLOSED
    ) {
      socketRef.current = new WebSocket(serverUrl);

      socketRef.current.onopen = () => {
        console.log("Connected to WebSocket server");
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        // Send pending messages when connection is established
        sendPendingMessages();
      };

      socketRef.current.onmessage = (event) => {
        const data: Message = JSON.parse(event.data);

        console.log("Acknowledgment received:", data);

        if (data.event_type == "acknowledgment") {
          handleAcknowledgment(data);
        } else if (data.event_type === "receive_message") {
          recieveMessage(data);
        }
      };

      socketRef.current.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setIsConnected(false);
        attemptReconnect();
      };
    }
  }, [serverUrl]);

  const attemptReconnect = useCallback(() => {
    if (!reconnectTimeoutRef.current) {
      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log("Attempting to reconnect...");
        connect();
      }, reconnectInterval);
    }
  }, [connect, reconnectInterval]);

  const sendMessage = async (messageData: Message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if (messageData.id) delete messageData.id;

      console.log("Sending message:", messageData);
      socketRef.current.send(JSON.stringify(messageData));
      // setPendingMessages((prev) => [...prev, messageData]); // Track pending message
    } else {
      await handleUnSentMessage(messageData);

      console.log("Unable to send message, WebSocket is not connected.");
      connect();
    }
  };

  const handleUnSentMessage = async (data: Message) => {
    try {
      // Check if the message is already present in the Messages table
      const isPresent = await db
        .select()
        .from(Messages)
        .where(eq(Messages.temp_id, data.temp_id));

      // If the message is not present in the Messages table, insert it
      if (isPresent.length == 0) {
        await db.insert(Messages).values({
          id: uuid.v4(),
          temp_id: data.temp_id,
          event_type: "send_message",
          sender_id: data.sender_id!,
          receiver_id: data.receiver_id,
          content: data.content,
          status: "pending",

          created_at: new Date(),
        });
      }
    } catch (error) {
      console.error("Error saving message to Messages table:", error);
    }
  };

  const recieveMessage = async (messageData: Message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending Acknowledgement:", {
        ...messageData,
        event_type: "ack_received",
      });
      socketRef.current.send(
        JSON.stringify({
          ...messageData,
          event_type: "ack_received",
        })
      );
    } else {
      console.log("Unable to send message, WebSocket is not connected.");
    }
    try {
      await db.insert(Messages).values({
        id: messageData.id as string,
        temp_id: messageData.temp_id as string,
        event_type: messageData.event_type,
        sender_id: messageData.sender_id ?? "",
        receiver_id: messageData.receiver_id ?? "",
        content: messageData.content ?? "",
        created_at: new Date(messageData.created_at!),
      });
    } catch (error) {
      console.error("Error saving message to Messages table:", error);
    }
  };

  const handleAcknowledgment = async (ackData: Message) => {
    // Save the acknowledged message to the Messages table
    try {
      const data = await db
        .select()
        .from(Messages)
        .where(eq(Messages.temp_id, ackData.temp_id));

      if (data.length > 0) {
        await db
          .update(Messages)
          .set({
            id: ackData.id,
            status: ackData.status,
            delivered: ackData.delivered ? true : false,
            delivered_at: ackData.delivered_at,
          })
          .where(eq(Messages.temp_id, ackData.temp_id));
      } else {
        await db.insert(Messages).values({
          id: ackData.id as string,
          temp_id: ackData.temp_id,
          event_type: "send_message",
          sender_id: ackData.sender_id ?? "",
          receiver_id: ackData.receiver_id ?? "",
          content: ackData.content ?? "",
          created_at: new Date(ackData.created_at!),
          status: ackData.status,
          delivered: ackData.delivered ? true : false,
          delivered_at: ackData.delivered_at,
        });
      }

      // console.log("Acknowledged message saved to Messages table:", ackData, {});
    } catch (error) {
      console.error("Error saving message to Messages table:", error);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return (
    <WebSocketContext.Provider
      value={{ messages, sendMessage, isConnected, setMessages }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
