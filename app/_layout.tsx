import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-reanimated";

import SearchBar from "@/components/search/SearchBar";
import FloatingPlayer from "@/components/songs/FloatingPlayer";
import { Colors } from "@/constants/Colors";
import { useLogTrackPlayerState } from "@/hooks/useLogTrackPlayerState";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";
import { playbackService } from "@/services/playbackServices";
import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";

// Screens on which the floating mini-player bar should NOT be shown
const hideFloatingPlayerScreens = [
  "profile",
  "player",
  "queue",
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
TrackPlayer.registerPlaybackService(() => playbackService);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const { currentSong } = usePlayerStore();

  const { bottom } = useSafeAreaInsets();
  const bottomOffset = bottom + 8;

  const currentSegment = segments[segments.length - 1];

  const { getCurrentUser } = useUserStore();
  const { disconnectSocket, socket } = useSocketStore();

  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useSetupTrackPlayer({ onLoad: handleTrackPlayerLoaded });
  useLogTrackPlayerState();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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

  const showFloatingPlayer =
    currentSong && !hideFloatingPlayerScreens.includes(currentSegment);

  return (
    <GluestackUIProvider mode={colorScheme === "light" ? "light" : "dark"}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="player"
                  options={{
                    presentation: "transparentModal",
                    headerShown: false,
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="queue"
                  options={{
                    presentation: "transparentModal",
                    headerShown: false,
                    animation: "slide_from_bottom",
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

              {/* Floating mini-player bar — only shown on non-player screens */}
              {showFloatingPlayer && (
                <FloatingPlayer
                  style={{
                    position: "absolute",
                    left: 8,
                    right: 8,
                    bottom: withoutTabBarScreens.includes(currentSegment)
                      ? bottomOffset
                      : bottom + 58,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                />
              )}
            </GestureHandlerRootView>
          </>
        </ThemeProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
