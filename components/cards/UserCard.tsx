import { Image, View } from "react-native";
import React from "react";
import { User } from "@/state/queries/users/users";
import Text from "../Text";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { cssInterop } from "nativewind";

type Props = {
  userData: User;
  addUser: (user: User) => void;
};
const UserCard = ({ userData, addUser }: Props) => {
  cssInterop(Feather, {
    className: {
      target: "style",
      //@ts-ignore
      nativeStyleToProp: { height: true, width: true, size: true },
    },
  });
  return (
    <View className="bg-card px-4 py-2 rounded-lg flex-row gap-4 border border-input">
      <Image
        src={
          "https://i.pinimg.com/736x/1f/54/0c/1f540cab2a3818950ca76c42211db9fe.jpg"
        }
        className="h-16 w-16 rounded-full"
      />
      <View className="flex-row justify-between flex-1">
        <View className="mt-2">
          <Text>
            {userData.username
              .split("")
              .map((v, i) => (i == 0 ? v.toUpperCase() : v))
              .join("")}
          </Text>
        </View>
        <View className="justify-center">
          <TouchableOpacity>
            <Feather
              name="user-plus"
              size={24}
              className="text-primary"
              onPress={() => addUser(userData)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserCard;
