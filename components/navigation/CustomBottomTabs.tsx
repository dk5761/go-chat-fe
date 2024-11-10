import { View, ViewStyle, TextStyle, Pressable } from "react-native";
import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Text from "../Text";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/utils";

interface CustomTabBarProps extends BottomTabBarProps {
  style?: ViewStyle;
  labelStyle?: TextStyle;
  activeTabStyle?: any;
  indicatorColor?: string;
  active?: boolean;
}

const IconTextStyles = cva("font-rubik-medium font-md text-foreground", {
  variants: {
    focused: {
      true: " text-green-200",
      false: "",
    },
  },
  defaultVariants: {
    focused: false,
  },
});

const CustomBottomTabs = ({
  state,
  descriptors,
  navigation,
}: CustomTabBarProps) => {
  return (
    <View className="flex-row absolute bottom-4 left-0 right-0 w-full justify-center items-center">
      <View className="flex-row px-4 py-2 justify-center items-center rounded-xl bg-card gap-4 shadow shadow-black ">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = options.tabBarIcon ?? null;

          return (
            <View key={index} className="">
              <Pressable
                onPress={onPress}
                className="justify-center items-center px-4 py-2 gap-2"
              >
                {Icon ? (
                  <Icon
                    focused={isFocused}
                    size={18}
                    color={isFocused ? "#bbf7d0" : "gray"}
                  />
                ) : (
                  ""
                )}
                <Text className={cn(IconTextStyles({ focused: isFocused }))}>
                  {options.title}
                </Text>
                {/* <NavigationIcon route={label} isFocused={isFocused}/> */}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomTabs;
