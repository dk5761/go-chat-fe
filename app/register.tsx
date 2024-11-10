import { View } from "react-native";
import React from "react";
import Login from "@/forms/Login";
import { toast } from "sonner-native";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/state/queries/auth/auth";
import { router } from "expo-router";

type Props = {};

const Register = (props: Props) => {
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
      return signUp(email, username, password);
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
          // setAuthToken(data.token);
          router.replace("/");
        },
        onError: (err, as) => {
          toast.error("Error", {
            description: err.message,
            styles: {
              toast: {
                backgroundColor: "#1e293b",
              },
            },
          });
        },
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
        btnText="Register"
        title="Register"
        redirectPath="/"
      />
    </View>
  );
};

export default Register;
