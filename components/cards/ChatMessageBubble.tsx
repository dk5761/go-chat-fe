import { View } from "react-native";
import React from "react";
import { cva } from "class-variance-authority";
import Text from "../Text";
import { cn } from "@/utils/utils";
import { MessageStatus } from "@/state/context/websocket/websocketContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { cssInterop } from "nativewind";

interface Message {
  event_type: string;
  sender_id?: string;
  content: string;
  receiver_id?: string;
  id?: string; // Assuming messages have an ID for acknowledgment
  created_at?: string;
  delivered?: boolean | undefined | null;
  delivered_at?: string | null;
  status: MessageStatus;
}

interface ChatMessageBubbleProps {
  message: Message;
  recieverId: string;
}

const MessageContainerStyles = cva(
  " px-3 py-2 rounded-xl flex-row gap-2 overflow-hidden flex-wrap",
  {
    variants: {
      message: {
        sender:
          "text-primaryForeground bg-primary self-end max-w-[75%] rounded-br-none mb-2 mr-1 ",
        reciever: "bg-muted  max-w-[75%] self-start rounded-bl-none mb-2 ml-1 ",
        default: "",
      },
    },
    defaultVariants: {
      message: "default",
    },
  }
);

const MessageTextStyles = cva("", {
  variants: {
    message: {
      sender: "text-white ",
      reciever: "text-mutedForeground",
      default: "",
    },
  },
  defaultVariants: {
    message: "default",
  },
});

const MessageDtStyles = cva("mt-1 text-xs", {
  variants: {
    message: {
      sender: "text-primaryForeground ",
      reciever: "text-mutedForeground",
      default: "",
    },
  },
  defaultVariants: {
    message: "default",
  },
});

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  recieverId,
}) => {
  const isSender = message.sender_id != recieverId;

  cssInterop(FontAwesome5, {
    className: {
      target: "style",
      //@ts-ignore
      nativeStyleToProp: { height: true, width: true, size: true },
    },
  });

  const dateTime = (
    <Text
      className={cn(
        MessageDtStyles({
          message: isSender ? "sender" : "reciever",
        })
      )}
    >
      {new Date(message.created_at || "").toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Use 24-hour format
      })}
    </Text>
  );

  const messageContent = (
    <Text
      className={cn(
        MessageTextStyles({
          message: isSender ? "sender" : "reciever",
        })
      )}
    >
      {message.content}
    </Text>
  );

  const statusContent = (status: MessageStatus) => {
    // console.log({ status });
    switch (status) {
      case MessageStatus.STORED:
      case MessageStatus.SENT:
        return (
          <FontAwesome5
            name="check"
            size={10}
            className="text-muted opacity-40 self-end"
          />
        );
      case MessageStatus.RECEIVED:
        return (
          <FontAwesome5
            name="check-double"
            size={10}
            className="text-muted opacity-40 self-end"
          />
        );
      case MessageStatus.READ:
        return (
          <FontAwesome5
            name="check-double"
            size={10}
            className="text-sky-400 opacity-40 self-end"
          />
        );
    }
  };

  // console.log(statusContent(message.status));

  return (
    <View
      className={cn(
        MessageContainerStyles({
          message: isSender ? "sender" : "reciever",
        })
      )}
    >
      {messageContent}
      {dateTime}
      {isSender && statusContent(message.status)}
    </View>
  );
};

export default ChatMessageBubble;
