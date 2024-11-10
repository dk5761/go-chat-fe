import Button from "@/components/Button";
import ChatMessageBubble from "@/components/cards/ChatMessageBubble";
import Input from "@/components/Input";
import CustomUserChatHeader from "@/components/navigation/CustomUserChatTabHeader";
import Text from "@/components/Text";
import View from "@/components/View";
import db from "@/services/db";
import { ChatList, Messages, Users } from "@/services/db/schema";
import {
  MessageStatus,
  useWebSocket,
} from "@/state/context/websocket/websocketContext";
import { Feather } from "@expo/vector-icons";
import { desc, eq, or } from "drizzle-orm";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

type Props = {};

cssInterop(Ionicons, {
  className: {
    target: "style",
    //@ts-ignore
    nativeStyleToProp: { height: true, width: true, size: true },
  },
});

const UserChat = (props: Props) => {
  const { id, name } = useLocalSearchParams();
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const { sendMessage, messages, setMessages } = useWebSocket();

  const { data: chatData } = useLiveQuery(
    db
      .select()
      .from(Messages)
      .where(
        or(
          eq(Messages.receiver_id, id as string),
          eq(Messages.sender_id, id as string)
        )
      )
      .orderBy(desc(Messages.created_at))
  );

  useFocusEffect(
    useCallback(() => {
      const updateChatListWithLatestMessage = async () => {
        try {
          const [latestMessage] = await db
            .select({
              id: Messages.id,
              createdAt: Messages.created_at,
            })
            .from(Messages)
            .where(
              or(
                eq(Messages.receiver_id, id as string),
                eq(Messages.sender_id, id as string)
              )
            )
            .orderBy(desc(Messages.created_at))
            .limit(1);

          if (latestMessage) {
            // Update the ChatList entry for the user with the latest message
            await db
              .update(ChatList)
              .set({
                lastMessage: latestMessage.id,
                lastMessageDatetime: latestMessage.createdAt,
              })
              .where(eq(ChatList.userId, id as string));
          }
        } catch (error) {
          console.error("Error updating ChatList with latest message:", error);
        }
      };

      return () => {
        updateChatListWithLatestMessage();
        setMessages([]);
      };
    }, [setMessages])
  );

  const handleSendMessage = () => {
    const messageData = {
      event_type: "send_message",
      receiver_id: id as string, // Use the current `id` from the route params
      content: message,
      status: MessageStatus.SENT,
    };
    sendMessage(messageData);
    setMessage("");
  };

  // Combine real-time messages and fetched messages for FlatList
  const allMessages = [...messages, ...chatMessages];

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      keyboardVerticalOffset={120}
      behavior="padding"
    >
      <View className="flex-1 px-2 ">
        <Stack.Screen
          options={{
            header: (props) => {
              return (
                <CustomUserChatHeader
                  title={name as string}
                  showBackButton={true}
                />
              );
            },
          }}
        />
        <View className="flex-shrink flex-1 border border-input rounded-lg p-2">
          <FlatList
            data={chatData}
            keyExtractor={(item, index) => `${item.id || index}`}
            renderItem={({ item }) => {
              return (
                <ChatMessageBubble
                  recieverId={id as string}
                  message={item as any}
                  key={item.id}
                />
              );
            }}
            inverted // To show the latest message at the bottom
          />
        </View>
        <View className=" flex-row gap-2 items-center mt-2 bottom-1">
          <Input
            value={message}
            onChangeText={(text) => setMessage(text)}
            placeholder="Type Username to Search..."
            className="flex-1 h-14"
          />
          <Button
            title={
              <Ionicons name="send-outline" size={18} className="text-white" />
            }
            onPress={handleSendMessage}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserChat;
