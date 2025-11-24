import { Input, InputField } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import useToastMessage from "@/hooks/useToastMessage";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { SendHorizonalIcon, SmileIcon } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChatInput = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom } = useSafeAreaInsets();
  const { showToast } = useToastMessage();

  const { sendMessage } = useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!currentUser || !currentRoom) return;
    if (!message) return showToast("Please enter some message to send");

    sendMessage(message, currentUser?._id, currentRoom?.roomId);
    setMessage("");
  };

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
        <InputField
          value={message}
          onChangeText={setMessage}
          placeholder="Say something..."
        />
      </Input>
      <TouchableOpacity
        style={{
          padding: 8,
          borderRadius: 9999,
          backgroundColor: colors.primary,
        }}
        onPress={handleSendMessage}
      >
        <SendHorizonalIcon size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
