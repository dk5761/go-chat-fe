import { View, Text, StatusBar } from "react-native";
import React from "react";
import { colorScheme } from "nativewind";

type Props = {};

const Settings = (props: Props) => {
  return (
    <View className="bg-background flex-1">
      <StatusBar
        backgroundColor={colorScheme.get() == "dark" ? "#000" : "#fff"}
        barStyle={"dark-content"}
      />
      <Text>settings</Text>
    </View>
  );
};

export default Settings;
