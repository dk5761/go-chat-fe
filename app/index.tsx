import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {};

const index = (props: Props) => {
  return (
    <View className=" flex-1  border-red-300 border-2 px-2 py-2 justify-center items-center">
      <Text
        style={{
          // fontFamily: "",
          fontSize: 74,

          fontWeight: "900",
        }}
      >
        Index
      </Text>
    </View>
  );
};

export default index;
