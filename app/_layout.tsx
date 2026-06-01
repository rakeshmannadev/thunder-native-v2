import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
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

import ErrorBoundary from "@/components/ErrorBoundary";
import SearchBar from "@/components/search/SearchBar";
import FloatingPlayer from "@/components/songs/FloatingPlayer";
import { Colors } from "@/constants/Colors";
import { useLogTrackPlayerState } from "@/hooks/useLogTrackPlayerState";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";
import { getCurrentUser } from "@/services/authServices";
import { playbackService } from "@/services/playbackServices";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";

SplashScreen.preventAutoHideAsync();
TrackPlayer.registerPlaybackService(() => playbackService);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      gcTime: 10 * 60 * 1000, //10 mins
      staleTime: 5 * 60 * 1000, //5 mins
    },
    mutations: {
      retry: 5,
    },
  },
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();

  const { setCurrentUser } = useUserStore();
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

  // Fetch current user using useQuery and sync it with the Zustand store
  useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const res = await getCurrentUser();
        if (res && res.user) {
          setCurrentUser(res.user);
          return res.user;
        }
        setCurrentUser(null);
        return null;
      } catch (error) {
        setCurrentUser(null);
        throw error;
      }
    },
    retry: false,
  });

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
    <GluestackUIProvider mode={colorScheme as "light" | "dark"}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
            <BottomSheetModalProvider>
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
                    gestureEnabled: Platform.OS === "ios",
                    gestureDirection:
                      Platform.OS === "ios" ? "vertical" : undefined,
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
                <Stack.Screen
                  name="featured/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="trending/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="artists/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="albums/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="downloads/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>

              {/* Floating mini-player bar — manages its own visibility */}
              <FloatingPlayer segments={segments} />
            </BottomSheetModalProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
