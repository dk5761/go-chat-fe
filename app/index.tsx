import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Login from "@/forms/Login";
import useAuthContext from "@/hooks/contextHooks/useAuthContext";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/state/queries/auth/auth";
import { router } from "expo-router";

const index = () => {
  const { setAuthToken } = useAuthContext();

  const mutation = useMutation({
    mutationFn: ({
      email,
      username,
      password,
    }: {
      email: string;
      username: string;
      password: string;
    }) => {
      return login(email, username, password);
    },
  });

  const onClickHandler = ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    mutation.mutate(
      {
        username,
        email,
        password,
      },
      {
        onSuccess: (data) => {
          setAuthToken(data.token);
          router.replace("/");
        },
        onError: (err) => {},
      }
    );
  };

  return (
    <View
      className="flex-1  px-2 py-2 justify-center items-center
      bg-background"
    >
      {/* <Text className="font-rubik-thin text-6xl">Index</Text> */}
      {/* <Button title="test" onPress={() => {}} />
      <Input value="asd" /> */}
      <Login
        onSubmitCB={(data) => onClickHandler(data)}
        btnText="Login"
        title="Login"
        redirectPath="/register"
      />
    </View>
  );
};

export default index;
