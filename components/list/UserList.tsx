import { View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { User } from "@/state/queries/users/users";
import UserCard from "../cards/UserCard";
import Text from "../Text";

type Props = {
  users: User[];
  addUser: (user: User) => void;
  loading: boolean;
};

const UserList = ({ users, addUser, loading }: Props) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-mutedForeground ">Loading...</Text>
      </View>
    );
  }

  if (users.length == 0) {
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
        data={users}
        renderItem={({ item }) => (
          <UserCard userData={item} addUser={addUser} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default UserList;
