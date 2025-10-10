import { HapticTab } from "@/components/HapticTab";
import HeaderRight from "@/components/HeaderRight";
import FloatingPlayer from "@/components/songs/FloatingPlayer";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { LogoIcon } from "@/constants/Icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();

  const currentSegment = segments[segments.length - 1]; //
  const hideFloatingPlayerScreens = [
    "profile",
    "player",
    "auth",
    "Signup",
    "Login",
    "search",
  ];
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          headerTransparent: true,
          headerLeft: () => <LogoIcon />,
          headerRight: () => <HeaderRight />,
          headerStyle: {
            backgroundColor:
              Colors[colorScheme === "light" ? "light" : "dark"].background,
          },
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor:
              Colors[colorScheme === "light" ? "light" : "dark"].background,
            borderWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
            headerTitle: "Thunder",
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: { marginLeft: 10 },
          }}
        />
        <Tabs.Screen
          name="library/index"
          options={{
            title: "Library",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="bookmark" color={color} />
            ),
            headerTitle: "Library",
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: { marginLeft: 10 },
          }}
        />
        <Tabs.Screen
          name="rooms/index"
          options={{
            title: "Rooms",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="coffee" color={color} />
            ),
            headerTitle: "Rooms",
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: { marginLeft: 10 },
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            ),
            headerTitle: "Profile",
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: { marginLeft: 10 },
          }}
        />
      </Tabs>
      <FloatingPlayer
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 80,
          borderRadius: 0,
          pointerEvents: "box-none",
          display: hideFloatingPlayerScreens.includes(currentSegment)
            ? "none"
            : "flex",
        }}
      />
    </>
  );
}
