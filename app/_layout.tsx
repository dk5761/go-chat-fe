import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { colorScheme } from "nativewind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AuthProvider } from "@/state/context/auth/authContext";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import db from "@/services/db";
import migrations from "@/drizzle/migrations";
import {
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  Rubik_800ExtraBold,
  Rubik_900Black,
} from "@expo-google-fonts/rubik";
import { Toaster } from "sonner-native";
// Use imperatively
colorScheme.set("system");

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000 * 5,
      //retry logic to only refetch a api thrice.
      retry: (count, _) => {
        if (count >= 3) {
          return false;
        }
        return true;
      },
    },
  },
});

export default function RootLayout() {
  const [loaded] = useFonts({
    "rubik-thin": Rubik_300Light,
    "rubik-regular": Rubik_400Regular,
    "rubik-medium": Rubik_500Medium,
    "rubik-semibold": Rubik_600SemiBold,
    "rubik-bold": Rubik_700Bold,
    "rubik-extrabold": Rubik_800ExtraBold,
    "rubik-black": Rubik_900Black,
  });

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (loaded && success) {
      SplashScreen.hideAsync();
    }
  }, [loaded, success]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <KeyboardProvider>
          <AuthProvider>
            <Slot />
            <Toaster />
          </AuthProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
