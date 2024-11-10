import {
  View,
  Text,
  TextInputProps,
  TextStyle,
  StyleProp,
  DimensionValue,
  TextInput,
} from "react-native";
import React, { forwardRef } from "react";
import { cn } from "@/utils/utils";

type InputProps = TextInputProps & {
  label?: string;
  style?: StyleProp<TextStyle>;
};
const Input = forwardRef<TextInput, InputProps>(
  ({ label, style, className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        {...props}
        className={cn(
          "border border-input bg-transparent rounded-lg px-2 h-10 selection:text-mutedForeground placeholder:text-mutedForeground text-cardForeground ",
          className
        )}
      />
    );
  }
);

export default Input;
