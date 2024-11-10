import { StatusBar } from "react-native";
import { Redirect, SplashScreen, Stack, Tabs, useSegments } from "expo-router";
import useAuthContext from "@/hooks/contextHooks/useAuthContext";
import { WebSocketProvider } from "@/state/context/websocket/websocketContext";
import { wsBaseUrl } from "@/services/api/constants";
import useStorage from "@/services/storage/useStorage";
import { useGetProfile } from "@/state/queries/users/users";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import CustomHeader from "@/components/navigation/CustomTabHeader";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomBottomTabs from "@/components/navigation/CustomBottomTabs";
import { useExpoRouter } from "expo-router/build/global-state/router-store";
import { useMemo } from "react";
import View from "@/components/View";
import Text from "@/components/Text";

export default function AppLayout() {
  const {
    state: { token },
  } = useAuthContext();
  const isLoggedIn = token;

  const router = useExpoRouter();

  const { purgeLocalStorage } = useStorage("token");

  const { data, isLoading, error } = useGetProfile({});

  const segments = useSegments();

  console.log(segments);
  const nestedHomePageOpened = useMemo(() => {
    return (
      segments.length > 2 && segments[0] === "(app)" && segments[1] === "chat"
    );
  }, [segments]);

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isLoggedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.

    SplashScreen.hideAsync();
    console.log("inside");
    return <Redirect href={"/(auth)/login"} />;
  }

  SplashScreen.hideAsync();

  if (error) {
    purgeLocalStorage();
    console.log("inside2");

    return <Redirect href={"/(auth)/login"} />;
  }

  if (isLoading) {
    console.log("inside3");

    return (
      <View className="justify-center items-center flex-1">
        <Text>Loading...</Text>
      </View>
    );
  }

  if ((!isLoading && !data) || (!isLoading && data && !data.id) || !data) {
    purgeLocalStorage();
    return <Redirect href={"/(auth)/login"} />;
  }
  console.log("inside4");

  console.log({ data });
  // This layout can be deferred because it's not the root layout.
  return (
    <WebSocketProvider serverUrl={`${wsBaseUrl}/api/chat/ws?userID=${data.id}`}>
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: "blue",

          header: (props) => {
            return <CustomHeader title={props.options.title ?? ""} />;
          },
        }}
        tabBar={(props) => <CustomBottomTabs {...props} />}
        initialRouteName="/chat"
      >
        <Tabs.Screen
          name="chat"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
            headerShown: false,
            tabBarStyle: nestedHomePageOpened ? { display: "none" } : {},
            href: "/chat",
          }}
        />
        <Tabs.Screen
          name="addUser"
          options={{
            title: "Search",

            tabBarIcon: ({ color }) => (
              <Feather name="search" size={24} color={color} />
            ),
            headerShadowVisible: false,
          }}
        />
      </Tabs>
    </WebSocketProvider>
  );
}
