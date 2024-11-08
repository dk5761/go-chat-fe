import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input"; // Custom Input component
import Label from "@/components/ui/Label"; // Custom Label component
import Button from "@/components/ui/Button"; // Custom Button component
import { stylesConstants } from "@/common/styleConstants";
import Text from "@/components/ui/Text";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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
}

const Login: React.FC<ILoginForm> = ({ onSubmitCB, btnText, title }) => {
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

  const { styles } = useStyles(stylesheet);

  const onSubmit = (data: LoginSchema) => {
    onSubmitCB(data);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          width: "100%",
          // alignItems: "center",
        }}
      >
        <Text
          weight="semiBold"
          style={{
            marginBottom: stylesConstants.FOUR,
          }}
        >
          {title}
        </Text>
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
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

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
        <Text style={styles.error}>{errors.username.message}</Text>
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
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {/* Submit Button */}
      <Button title={btnText} onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default Login;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: "80%",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
}));
