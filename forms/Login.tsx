import React from "react";
import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Text from "@/components/Text";
import { Link } from "expo-router";

// Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

interface ILoginForm {
  onSubmitCB: (data: LoginSchema) => void;
  btnText: string;
  title: string;
  redirectPath: string;
}

const Login: React.FC<ILoginForm> = ({
  onSubmitCB,
  btnText,
  title,
  redirectPath,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "1@dk.com",
      password: "dk@123",
      username: "one",
    },
  });

  const path = redirectPath ?? "/";

  const onSubmit = (data: LoginSchema) => {
    onSubmitCB(data);
  };

  return (
    <View className="w-5/6 gap-2 bg-card border border-border p-6 rounded-md">
      <View className="justify-center w-full items-center mb-6">
        <Text className="text-2xl">{title}</Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && (
        <Text className="text-destructive mb-2">{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.username && (
        <Text className="text-destructive mb-2">{errors.username.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password?.message && (
        <Text className="text-destructive mb-2">{errors.password.message}</Text>
      )}

      {/* Submit Button */}
      <Button
        title={btnText}
        onPress={handleSubmit(onSubmit)}
        className="mt-4"
      />

      <Link href={path as any} className="text-center text-mutedForeground">
        New?? Register then!!
      </Link>
    </View>
  );
};

export default Login;
