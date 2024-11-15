import { StatusBar } from "react-native";
import React from "react";
import { useWebSocket } from "@/state/context/websocket/websocketContext";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import db from "@/services/db";
import { ChatList, Messages, Users } from "@/services/db/schema";
import { eq } from "drizzle-orm";
import { Stack, Tabs } from "expo-router";
import CustomChatHeader from "@/components/navigation/CustomChatHeader";
import { useGetProfile } from "@/state/queries/users/users";
import { colorScheme } from "nativewind";
import View from "@/components/View";
import Text from "@/components/Text";
import UserList from "@/components/list/ChatList";

type Props = {};

const Home = (props: Props) => {
  const { isConnected } = useWebSocket();
  const { data, isLoading, error } = useGetProfile({});

  // console.log({ data });

  const { data: chatListData } = useLiveQuery(
    db
      .select({
        user: {
          id: Users.id,
          username: Users.username,
          email: Users.email,
        },
        lastMessage: Messages,
      })
      .from(ChatList)
      .leftJoin(Users, eq(ChatList.userId, Users.id))
      .leftJoin(Messages, eq(ChatList.lastMessage, Messages.id))
  );

  if (!data || error) {
    return (
      <View className="justify-center items-center">
        <Text>Oops! something went wront</Text>
      </View>
    );
  }

  const scheme = colorScheme.get();

  return (
    <View className=" flex-1 px-4">
      <StatusBar backgroundColor={scheme == "dark" ? "#000" : "#fff"} />
      <Stack.Screen
        options={{
          header: (props) => {
            return (
              <CustomChatHeader
                title="Chat"
                name={data?.username ?? ""}
                status={isConnected ? "Online" : "Offline"}
                imageUrl="https://i.pinimg.com/736x/1f/54/0c/1f540cab2a3818950ca76c42211db9fe.jpg"
              />
            );
          },
          headerShadowVisible: false,
        }}
      />
      <Text className="text-foreground text-3xl font-rubik-medium text-start my-2">
        Chats
      </Text>
      <UserList data={chatListData} />
    </View>
  );
};

export default Home;
