import { StatusBar, Text } from "react-native";
import { Redirect, SplashScreen, Stack, Tabs } from "expo-router";
import useAuthContext from "@/hooks/contextHooks/useAuthContext";
import { WebSocketProvider } from "@/state/context/websocket/websocketContext";
import { wsBaseUrl } from "@/services/api/constants";
import useStorage from "@/services/storage/useStorage";
import { useGetProfile } from "@/state/queries/users/users";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import CustomHeader from "@/components/navigation/CustomHeader";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomBottomTabs from "@/components/navigation/CustomBottomTabs";

export default function AppLayout() {
  const {
    state: { token },
  } = useAuthContext();
  const isLoggedIn = token;

  const { purgeLocalStorage } = useStorage("token");

  const { data, isLoading, error } = useGetProfile({});

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isLoggedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("inside");
    SplashScreen.hideAsync();
    return <Redirect href="/login" />;
  }

  SplashScreen.hideAsync();
  if (error) {
    purgeLocalStorage();
    return <Redirect href={"/login"} />;
  }
  console.log("inside 2");

  // This layout can be deferred because it's not the root layout.
  return (
    <WebSocketProvider
      serverUrl={`${wsBaseUrl}/api/chat/ws?userID=${data?.id}`}
    >
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: "blue",

          header: (props) => {
            return <CustomHeader title="" showBackButton={true} />;
          },
        }}
        tabBar={(props) => <CustomBottomTabs {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
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
