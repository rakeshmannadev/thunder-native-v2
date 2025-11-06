import { Input, InputField } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import { SendHorizonalIcon, SmileIcon } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChatInput = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        width: "100%",
        height: 60,
        backgroundColor: colors.background,
        paddingHorizontal: screenPadding.horizontal,
        borderColor: colors.borderColor,
        borderTopWidth: 1,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 8,
          borderRadius: 9999,
          backgroundColor: colors.component,
        }}
      >
        <SmileIcon size={24} color={colors.icon} />
      </TouchableOpacity>

      <Input
        variant="rounded"
        size="xl"
        style={{
          flex: 1,
          backgroundColor: colors.component,
          borderRadius: borderRadius.lg,
          paddingBlock: 4,
          outline: "none",
          borderWidth: 0,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        <InputField placeholder="Say something..." />
      </Input>
      <TouchableOpacity
        style={{
          padding: 8,
          borderRadius: 9999,
          backgroundColor: colors.primary,
        }}
      >
        <SendHorizonalIcon size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
