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
        className="border border-gray-200 rounded-lg px-2 h-10 dark:bg-gray-700 
        dark:text-white dark:placeholder:text-slate-500 w-full dark:selection:text-white
            selection:text-sky-200 placeholder:text-slate-400
        "
      />
    );
  }
);

export default Input;
