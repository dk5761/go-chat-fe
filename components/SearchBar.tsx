import { View, Text } from "react-native";
import React from "react";
import Input from "./Input";
import Button from "./Button";
import Feather from "@expo/vector-icons/Feather";
import { cssInterop } from "nativewind";

interface SearchBarProps {
  input: string;
  setQ: (v: string) => void;
  setInput: (v: string) => void;
}

const SearchBar = ({ input, setInput, setQ }: SearchBarProps) => {
  cssInterop(Feather, {
    className: {
      target: "style",
      //@ts-ignore
      nativeStyleToProp: { height: true, width: true, size: true },
    },
  });

  return (
    <View className=" flex-row gap-2">
      <Input
        value={input}
        onChangeText={(text) => setInput(text)}
        placeholder="Type Username to Search..."
        className="flex-1 "
      />
      <Button
        title={<Feather name="search" size={18} className="text-white" />}
        onPress={() => {
          setQ(input.toLowerCase());
        }}
      />
    </View>
  );
};

export default SearchBar;
