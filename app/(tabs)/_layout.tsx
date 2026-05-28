import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
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
          headerTransparent: true,
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
              <MaterialCommunityIcons
                name="home-variant"
                size={28}
                color={color}
              />
            ),
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Tabs.Screen
          name="library/index"
          options={{
            title: "Library",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="bookshelf"
                size={28}
                color={color}
              />
            ),
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Tabs.Screen
          name="rooms/index"
          options={{
            title: "Rooms",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="radio-tower"
                color={color}
                size={28}
              />
            ),
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Profile",

            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                size={28}
                name="account-music"
                color={color}
              />
            ),
            headerShown: false,
            headerTransparent: true,
          }}
        />
      </Tabs>
    </>
  );
}
