import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { isValidElement } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/utils";

type ButtonVariant = "primary" | "secondary" | "inverse" | "disabled";

type ButtonProps = TouchableOpacityProps & {
  title: string | React.ReactNode;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: ButtonVariant;
  className?: string;
  textClassName?: string;
  loading?: boolean;
};

const ButtonStyles = cva("px-2 rounded-md h-10 justify-center items-center", {
  variants: {
    variant: {
      primary: "bg-primary  border border-input",
      secondary: "bg-slate-100 border border-gray-200",
      inverse: "bg-white border border-sky-300",
      disabled: "bg-gray-300",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const TextStyles = cva("", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-slate-900",
      inverse: "text-sky-300",
      disabled: "text-gray-500",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant,
  className,
  textClassName,
  loading,
  ...props
}) => {
  return (
    <TouchableOpacity
      disabled={variant == "disabled" || loading}
      className={cn(
        ButtonStyles({
          variant,
        }),
        className
      )}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size={Platform.select({ android: "large", default: "small" })}
        />
      ) : isValidElement(title) ? (
        title
      ) : (
        <Text
          className={cn(
            TextStyles({
              variant,
            }),
            textClassName
          )}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
