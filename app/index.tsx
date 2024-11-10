import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

type Props = {};

const index = (props: Props) => {
  return <Redirect href={"/(app)/chat"} />;
};

export default index;
