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
  dynamicHeight?: boolean; // Add this line
};

const Input = forwardRef<TextInput, InputProps>(
  ({ label, style, className, dynamicHeight, ...props }, ref) => {
    const [height, setHeight] = React.useState<DimensionValue>(40); // Initial height

    return (
      <TextInput
        ref={ref}
        {...props}
        multiline={dynamicHeight}
        onContentSizeChange={(e) => {
          if (dynamicHeight) {
            const newHeight = Math.min(
              e.nativeEvent.contentSize.height,
              5 * 40
            ); // Max height for 5 lines
            setHeight(newHeight);
          }
        }}
        style={[style, { height }]}
        className={cn(
          "border border-input bg-transparent rounded-lg px-2 selection:text-mutedForeground placeholder:text-mutedForeground text-cardForeground min-h-10 max-h-40",
          className
        )}
      />
    );
  }
);

export default Input;
