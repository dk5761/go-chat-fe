import { View, Text, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

type Props = {
  title: string;
  showBackButton: boolean;
};

const CustomUserChatHeader = ({ title, showBackButton }: Props) => {
  const router = useRouter();

  cssInterop(Ionicons, {
    className: {
      target: "style",
      //@ts-ignore
      nativeStyleToProp: { height: true, width: true, size: true },
    },
  });

  return (
    <View className="flex-row items-center gap-2 p-2 py-3 bg-background ">
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} className="text-foreground" />
        </TouchableOpacity>
      )}
      <View className="flex-row gap-3 items-center">
        <Image
          src={
            "https://i.pinimg.com/736x/1f/54/0c/1f540cab2a3818950ca76c42211db9fe.jpg"
          }
          className="h-12 w-12 rounded-full"
        />
        <Text className="text-foreground text-3xl font-rubik-medium text-start flex-1  ">
          {title}
        </Text>
      </View>
    </View>
  );
};

export default CustomUserChatHeader;
