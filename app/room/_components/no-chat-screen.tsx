import { Colors } from "@/constants/Colors";
import { MessageCircleIcon } from "lucide-react-native";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

const NoChatScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <View className="flex-1 flex-col gap-4 items-center justify-center">
      <MessageCircleIcon size={36} color={colors.icon} />

      <Text style={{ color: colors.text }}>No messages yet.</Text>
      <Text style={{ color: colors.textMuted }}>Be first to send a chat!</Text>
    </View>
  );
};

export default NoChatScreen;
