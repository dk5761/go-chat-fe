import { View as RNView, ViewProps } from "react-native";
import React from "react";
import { cn } from "@/utils/utils";

type Props = ViewProps;

const View = ({ children, className, ...props }: Props) => {
  return (
    <RNView className={cn("bg-background", className)} {...props}>
      {children}
    </RNView>
  );
};

export default View;
