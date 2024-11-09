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

type InputProps = TextInputProps & {
  label?: string;
  style?: StyleProp<TextStyle>;
  flex?: number;
};
const Input = forwardRef<TextInput, InputProps>(
  ({ label, style, flex, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[style]}
        {...props}
        className="w-full border border-input bg-transparent rounded-lg px-2 h-10 selection:text-mutedForeground placeholder:text-mutedForeground text-cardForeground"
      />
    );
  }
);

export default Input;
