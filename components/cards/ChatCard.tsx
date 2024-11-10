import { Image, Pressable, View } from "react-native";
import React from "react";
import { User } from "@/state/queries/users/users";
import Text from "../Text";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { cssInterop } from "nativewind";
import { router } from "expo-router";
import { isToday, isYesterday, format } from "date-fns";

type Props = {
  chatData: {
    user: {
      id: string;
      username: string;
      email: string;
    } | null;
    lastMessage: {
      id: string;
      created_at: string;
      event_type: string;
      sender_id: string;
      receiver_id: string;
      content: string;
      fileUrl: string | null;
    } | null;
  };
};
const ChatCard = ({ chatData }: Props) => {
  cssInterop(Feather, {
    className: {
      target: "style",
      //@ts-ignore
      nativeStyleToProp: { height: true, width: true, size: true },
    },
  });

  const user = chatData.user;
  const message = chatData.lastMessage;

  const createdAt =
    message && message?.created_at
      ? (() => {
          const date = new Date(message.created_at);

          if (isToday(date)) {
            return format(date, "HH:mm"); // e.g., "14:30"
          } else if (isYesterday(date)) {
            return "Yesterday";
          } else {
            return format(date, "dd MMM yyyy"); // e.g., "02 Nov 2024"
          }
        })()
      : "";

  if (!user) {
    return null;
  }

  const content =
    message?.content && message.content.length > 24
      ? message.content.substring(0, 24) + "..."
      : message?.content;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/(app)/chat/${user.id}` as any,
          params: {
            name: user.username,
          },
        })
      }
    >
      <View className="bg-card px-4 py-2 rounded-lg flex-row gap-4 border border-input ">
        <Image
          src={
            "https://i.pinimg.com/736x/1f/54/0c/1f540cab2a3818950ca76c42211db9fe.jpg"
          }
          className="h-16 w-16 rounded-full"
        />
        <View className="flex-row justify-between flex-1 ">
          <View className="mt-1 gap-2">
            <Text className="text-lg">
              {user?.username
                .split("")
                .map((v, i) => (i == 0 ? v.toUpperCase() : v))
                .join("")}
            </Text>
            <Text className="text-mutedForeground overflow-hidden flex-grow">
              {content || "--"}
            </Text>
          </View>
          <View className="justify-start mt-2  text-clip">
            <Text className="text-primary opacity-60 text-sm">{createdAt}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatCard;
