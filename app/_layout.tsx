import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { setAudioModeAsync } from "expo-audio";
import { useFonts } from "expo-font";
import { Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import SearchBar from "@/components/search/SearchBar";
import ExpandablePlayer from "@/components/songs/ExpandablePlayer";
import { Colors } from "@/constants/Colors";
import { getAudioPreference } from "@/helpers";
import PlayerProvider from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const hideFloatingPlayerScreens = [
  "profile",
  "player",
  "auth",
  "Signup",
  "Login",
  "menu",
  "settings",
  "create_room",
  "[id]",
  "library",
];
const withoutTabBarScreens = [
  "library_content",
  "search",
  "notification",
  "[id]",
  "create-room",
];
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const { setAudioPreference, currentSong } = usePlayerStore();

  const { bottom } = useSafeAreaInsets();
  const bottomOffSet = bottom + 50;

  const currentSegment = segments[segments.length - 1]; //

  const { getCurrentUser, currentUser } = useUserStore();
  const { disconnectSocket, socket } = useSocketStore();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // * Set audio mode to play in background and silent mode globally
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionModeAndroid: "doNotMix",
          interruptionMode: "doNotMix",
          shouldRouteThroughEarpiece: false,
        });
      } catch (error) {
        console.log("Error while setting global audio mode:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const setPreference = async () => {
      const preference = await getAudioPreference();
      setAudioPreference(preference!);
    };
    setPreference();
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, [socket, disconnectSocket]);

  if (!loaded) {
    return null;
  }

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <GluestackUIProvider mode={colorScheme === "light" ? "light" : "dark"}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <PlayerProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="auth"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="settings/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="search/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerStyle: {
                      backgroundColor: colors.background,
                    },
                    headerRight: () => <SearchBar />,
                  }}
                />
                <Stack.Screen
                  name="notification/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerStyle: {
                      backgroundColor: colors.background,
                    },
                  }}
                />
                <Stack.Screen
                  name="request_song/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerStyle: {
                      backgroundColor: colors.background,
                    },
                  }}
                />

                <Stack.Screen
                  name="library_content/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="create_room/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />

                <Stack.Screen
                  name="album/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="artist/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="song/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="playlist/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="room/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              {currentSong &&
                !hideFloatingPlayerScreens.includes(currentSegment) && (
                  <ExpandablePlayer
                    bottomOffset={
                      withoutTabBarScreens.includes(currentSegment)
                        ? 16
                        : bottomOffSet
                    }
                  />
                )}
            </GestureHandlerRootView>
          </PlayerProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
