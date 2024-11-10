import { Text as RNText, TextProps } from "react-native";
import React from "react";
import { cn } from "@/utils/utils";

type Props = TextProps & {
  className?: string;
};

const Text = ({ className, children, ...props }: Props) => {
  return (
    <RNText
      className={cn("font-rubik-medium text-foreground", className)}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;
