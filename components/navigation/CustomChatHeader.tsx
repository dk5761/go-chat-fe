import { View, Image } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import Text from "../Text";
import { colorScheme } from "nativewind";

type Props = {
  title: string;
  name: string;
  imageUrl: string;
  status: string;
};

const CustomChatHeader = ({ title, name, imageUrl, status }: Props) => {
  //   const router = useRouter();

  return (
    <View className="flex-row items-center justify-start p-4 bg-background gap-4">
      <Image src={imageUrl} className="h-24 w-24 rounded-full" />
      <View className="justify-between flex-row flex-1">
        <View>
          <Text className="text-xl font-rubik-medium text-foreground">
            {name
              .split("")
              .map((v, i) => (i == 0 ? v.toUpperCase() : v))
              .join("")}
          </Text>
          <Text className="text-xl font-rubik-medium text-foreground">
            {status}
          </Text>
        </View>
        {/* <View className="justify-start items-end">
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={colorScheme.get() == "dark" ? "#fff" : "#000"}
          />
        </View> */}
      </View>
    </View>
  );
};

export default CustomChatHeader;
