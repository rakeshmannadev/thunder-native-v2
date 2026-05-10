import { Input, InputField } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import useToastMessage from "@/hooks/useToastMessage";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Send, Smile } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, useColorScheme, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChatInput = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { bottom } = useSafeAreaInsets();
  const { showToast } = useToastMessage();

  const { sendMessage } = useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!currentUser || !currentRoom) return;
    if (!message.trim()) return showToast("Please enter some message to send");

    sendMessage(message, currentUser?._id, currentRoom?.roomId);
    setMessage("");
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom > 0 ? bottom : 16 }]}>
      <View style={[styles.innerContainer, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
        <TouchableOpacity style={styles.actionBtn}>
          <Smile size={22} color={colors.textMuted} />
        </TouchableOpacity>

        <Input style={styles.inputWrapper}>
          <InputField
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            style={{ color: colors.text, fontSize: 15 }}
            placeholderTextColor={colors.textMuted}
          />
        </Input>

        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: message.trim() ? colors.primary : 'rgba(255, 255, 255, 0.1)' }]}
          onPress={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send size={20} color={message.trim() ? 'white' : colors.textMuted} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 28,
    borderWidth: 1,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  }
});

export default ChatInput;
