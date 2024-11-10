import { View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  title: string;
  showBackButton: boolean;
};

const CustomHeader = ({ title, showBackButton }: Props) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between p-4 bg-background shadow-md">
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Text className="text-blue-500 text-lg">Back</Text>
        </TouchableOpacity>
      )}
      <Text className="text-lg font-bold text-center flex-1">{title}</Text>
    </View>
  );
};

export default CustomHeader;
