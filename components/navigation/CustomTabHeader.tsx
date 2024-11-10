import { View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

type Props = {
  title: string;
  // showBackButton: boolean;
};

const CustomHeader = ({ title }: Props) => {
  // const router = useRouter();

  // cssInterop(Ionicons, {
  //   className: {
  //     target: "style",
  //     //@ts-ignore
  //     nativeStyleToProp: { height: true, width: true, size: true },
  //   },
  // });

  return (
    <View className="flex-row items-center justify-between p-4 bg-background ">
      <Text className="text-foreground text-3xl font-rubik-medium text-start flex-1 ">
        {title}
      </Text>
    </View>
  );
};

export default CustomHeader;
