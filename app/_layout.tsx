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
import { useEffect } from "react";
import "react-native-reanimated";

import HeaderRight from "@/components/HeaderRight";
import SearchBar from "@/components/search/SearchBar";
import FloatingPlayer from "@/components/songs/FloatingPlayer";
import { Colors } from "@/constants/Colors";
import PlayerProvider from "@/providers/PlayerProvider";
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
];
const withoutTabBarScreens = [
  "library_content",
  "search",
  "notification",
  "[id]",
];
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();

  const { bottom } = useSafeAreaInsets();
  const bottomOffSet = bottom + 50;

  const currentSegment = segments[segments.length - 1]; //

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
                  name="library_content/index"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="player"
                  options={{
                    headerShown: false,
                    presentation: "formSheet",
                    animation: "slide_from_bottom",
                    gestureDirection: "vertical",
                    sheetGrabberVisible: true,
                    sheetInitialDetentIndex: 0,
                    sheetAllowedDetents: [1],
                    sheetExpandsWhenScrolledToEdge: true,
                    sheetElevation: 24,
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
                  name="artist/[id]"
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
                <Stack.Screen
                  name="menu"
                  options={{
                    headerShown: false,
                    presentation: "formSheet",
                    animation: "slide_from_bottom",
                    gestureDirection: "vertical",
                    sheetGrabberVisible: true,
                    sheetInitialDetentIndex: 1,
                    sheetAllowedDetents: [0.25, 0.5, 1],
                    sheetExpandsWhenScrolledToEdge: true,
                    sheetCornerRadius: 16,
                    sheetElevation: 24,
                  }}
                />
                <Stack.Screen
                  name="modal"
                  options={{
                    headerShown: false,
                    presentation: "formSheet",
                    animation: "slide_from_bottom",
                    gestureDirection: "vertical",
                    sheetGrabberVisible: true,
                    sheetInitialDetentIndex: 1,
                    sheetAllowedDetents: [0.5, 1],
                    sheetExpandsWhenScrolledToEdge: true,
                  }}
                />

                <Stack.Screen name="+not-found" />
              </Stack>
              <FloatingPlayer
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  bottom: withoutTabBarScreens.includes(currentSegment)
                    ? 16
                    : bottomOffSet,
                  borderRadius: 0,
                  pointerEvents: "box-none",
                  display: hideFloatingPlayerScreens.includes(currentSegment)
                    ? "none"
                    : "flex",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  animationName: "fadeInUp",
                  animationDuration: "500ms",
                  animationDirection: "normal",
                  animationPlayState: "running",
                  animationFillMode: "forwards",
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  overflow: "hidden",
                  zIndex: 10,
                }}
              />
            </GestureHandlerRootView>
          </PlayerProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
