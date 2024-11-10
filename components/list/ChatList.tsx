import { View } from "react-native";
import React from "react";
import { FlatList } from "react-native";

import Text from "../Text";
import ChatCard from "../cards/ChatCard";

type Props = {
  data: {
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
  }[];
};

const UserList = ({ data }: Props) => {
  if (data.length == 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-mutedForeground">No Data Found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 mt-2">
      <FlatList
        contentContainerClassName="gap-2"
        data={data}
        renderItem={({ item }) => <ChatCard chatData={item} />}
        keyExtractor={(item) => item.user?.id ?? Math.random() + ""}
      />
    </View>
  );
};

export default UserList;
