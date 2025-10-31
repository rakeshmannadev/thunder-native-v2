import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { BellIcon, SettingsIcon } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { HStack } from "./ui/hstack";

const HeaderRight = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  return (
    <HStack space="md" className="mr-5">
      <Pressable
        onPress={() => router.navigate("/notification")}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: pressed
              ? colors.secondaryBackground
              : "transparent", // Example pressed background color
          },
        ]}
      >
        {({ pressed }) => (
          <BellIcon size={24} color={pressed ? colors.accent : colors.icon} />
        )}
      </Pressable>

      <Pressable
        onPress={() => {
          router.navigate("/settings");
        }}
      >
        {({ pressed }) => (
          <SettingsIcon
            size={24}
            color={pressed ? colors.accent : colors.icon}
          />
        )}
      </Pressable>
    </HStack>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 50, // For a circular touch area
    justifyContent: "center",
    alignItems: "center",
  },
});
