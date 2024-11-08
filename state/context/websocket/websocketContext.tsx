import db from "@/services/db";
import { Messages } from "@/services/db/schema";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

interface Message {
  event_type: string;
  sender_id?: string;
  content: string;
  receiver_id?: string;
  id?: string; // Assuming messages have an ID for acknowledgment
  created_at?: string;
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
}> = ({ serverUrl, reconnectInterval = 5000, children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

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
      };

      socketRef.current.onmessage = (event) => {
        const data: Message = JSON.parse(event.data);

        console.log(data.event_type);

        if (data.event_type === "message_acknowledgment") {
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

  const sendMessage = (messageData: Message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending message:", messageData);
      socketRef.current.send(JSON.stringify(messageData));
      setPendingMessages((prev) => [...prev, messageData]); // Track pending message
    } else {
      console.log("Unable to send message, WebSocket is not connected.");
    }
  };

  const recieveMessage = async (messageData: Message) => {
    console.log("Recieving message:", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]); // Track pending message
    try {
      await db.insert(Messages).values({
        id: messageData.id as string,
        event_type: messageData.event_type,
        sender_id: messageData.sender_id ?? "",
        receiver_id: messageData.receiver_id ?? "",
        content: messageData.content ?? "",
        created_at: messageData.created_at ?? "",
      });

      console.log("Acknowledged message saved to Messages table:", messageData);
    } catch (error) {
      console.error("Error saving message to Messages table:", error);
    }
  };

  const handleAcknowledgment = async (ackData: Message) => {
    setPendingMessages((prev) => prev.filter((msg) => msg.id !== ackData.id));
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...ackData,
        event_type: "send_message",
      },
    ]);

    // Log acknowledgment for debugging
    console.log("Message acknowledged:", ackData);

    // Save the acknowledged message to the Messages table
    try {
      await db.insert(Messages).values({
        id: ackData.id as string,
        event_type: "send_message",
        sender_id: ackData.sender_id ?? "",
        receiver_id: ackData.receiver_id ?? "",
        content: ackData.content ?? "",
        created_at: ackData.created_at ?? "",
      });

      console.log("Acknowledged message saved to Messages table:", ackData);
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
