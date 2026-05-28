import { Colors } from "@/constants/Colors";
import { MessageCircleIcon } from "lucide-react-native";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

const NoChatScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <View style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)"
      }}>
        <MessageCircleIcon size={24} color={colors.textMuted} />
      </View>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700", letterSpacing: -0.2 }}>No messages yet</Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "500" }}>Be the first one to say hello!</Text>
      </View>
    </View>
  );
};

export default NoChatScreen;
