import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Login from "@/forms/Login";

type Props = {};

const Register = (props: Props) => {
  const onClickHandler = ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    // mutation.mutate(
    //   {
    //     username,
    //     email,
    //     password,
    //   },
    //   {
    //     onSuccess: (data) => {
    //       setAuthToken(data.token);
    //       router.replace("/");
    //     },
    //     onError: (err) => {},
    //   }
    // );
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
        btnText="Register"
        title="Register"
        redirectPath="/"
      />
    </View>
  );
};

export default Register;
