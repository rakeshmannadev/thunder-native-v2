import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-reanimated";

import HeaderRight from "@/components/HeaderRight";
import SearchBar from "@/components/search/SearchBar";
import FloatingPlayer from "@/components/songs/FloatingPlayer";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import PlayerProvider from "@/providers/PlayerProvider";
import useUserStore from "@/store/useUserStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRootNavigationState();
  const currentPath = router.routes[router.routes.length - 1].name;
  const showFloatingPlayBackScreens = [
    "album/[id]",
    "playlist/[id]",
    "song/[id]",
  ];

  const { getCurrentUser } = useUserStore();

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

  if (!loaded) {
    return null;
  }

  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  // useSetupTrackPlayer({
  //   onLoad: handleTrackPlayerLoaded,
  // });

  // useLogTrackPlayerState();

  return (
    <GluestackUIProvider mode={colorScheme === "light" ? "light" : "dark"}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <PlayerProvider>
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
                  name="search/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerStyle: {
                      backgroundColor:
                        Colors[colorScheme === "light" ? "light" : "dark"]
                          .background,
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
                      backgroundColor:
                        Colors[colorScheme === "light" ? "light" : "dark"]
                          .background,
                    },
                  }}
                />
                <Stack.Screen
                  name="player"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                    gestureEnabled: false,
                    gestureDirection: "horizontal",
                    animationDuration: 400,
                  }}
                />
                <Stack.Screen
                  name="album/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerRight: () => <HeaderRight />,
                  }}
                />
                <Stack.Screen
                  name="song/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerRight: () => <HeaderRight />,
                  }}
                />
                <Stack.Screen
                  name="playlist/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerRight: () => <HeaderRight />,
                  }}
                />

                <Stack.Screen name="+not-found" />
              </Stack>
              <FloatingPlayer
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 0,
                  display: showFloatingPlayBackScreens.includes(currentPath)
                    ? "flex"
                    : "none",
                }}
              />
            </PlayerProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
