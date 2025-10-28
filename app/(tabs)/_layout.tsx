import { HapticTab } from "@/components/HapticTab";
import HeaderRight from "@/components/HeaderRight";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { LogoIcon } from "@/constants/Icons";
import { fontSize } from "@/constants/tokens";

import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { CoffeeIcon, LibraryBig, LibraryIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.accent,
          headerShown: true,
          headerTransparent: true,
          headerLeft: () => <LogoIcon />,
          headerRight: () => <HeaderRight />,
          headerStyle: {
            backgroundColor: colors.background,
          },
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: colors.background,
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
            headerTitleStyle: {
              marginLeft: 4,
              color: colors.text,
              fontSize: fontSize.lg,
              fontWeight: "600",
              letterSpacing: 1,
            },
          }}
        />
        <Tabs.Screen
          name="library/index"
          options={{
            title: "Library",
            tabBarIcon: ({ focused, color }) =>
              focused ? (
                <LibraryBig size={28} color={color} />
              ) : (
                <LibraryIcon size={28} color={color} />
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
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <CoffeeIcon size={28} color={color} />
              ) : (
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
    </>
  );
}
