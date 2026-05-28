import { Input, InputField } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useToastMessage from "@/hooks/useToastMessage";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Smile } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChatInput = ({ currentRoom }: { currentRoom: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { bottom } = useSafeAreaInsets();
  const { showToast } = useToastMessage();

  const { sendMessage } = useSocketStore();
  const { currentUser } = useUserStore();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const handleSendMessage = async () => {
    if (!currentUser || !currentRoom) return;
    if (!message.trim()) return showToast("Please enter some message to send");

    setIsSending(true);
    sendMessage(message, currentUser?._id, currentRoom?.roomId);
    setMessage("");
    setIsSending(false);
    await queryClient.invalidateQueries({
      queryKey: ["room", currentRoom?.roomId],
    });
  };

  return (
    <View
      style={[styles.container, { paddingBottom: bottom > 0 ? bottom : 16 }]}
    >
      <View
        style={[
          styles.innerContainer,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
          },
        ]}
      >
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Smile size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <Input style={styles.inputWrapper}>
          <InputField
            value={message}
            onChangeText={setMessage}
            placeholder="Message..."
            style={{ 
              color: colors.text, 
              fontSize: 14.5,
              fontWeight: "550" as any,
              letterSpacing: -0.1,
              paddingVertical: 0,
            }}
            placeholderTextColor={colors.textMuted}
          />
        </Input>

        <TouchableOpacity
          style={[
            styles.sendBtn,
            {
              backgroundColor: message.trim()
                ? colors.primary
                : colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.03)",
            },
          ]}
          onPress={handleSendMessage}
          disabled={!message.trim() || isSending}
          activeOpacity={0.8}
        >
          <Send size={18} color={message.trim() ? "white" : colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: 12,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 28,
    borderWidth: 1,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default ChatInput;
