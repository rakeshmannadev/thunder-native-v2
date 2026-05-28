import { Colors } from "@/constants/Colors";
import useUserStore from "@/store/useUserStore";
import { Message } from "@/types";
import React from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";

const Chat = ({ message }: { message: Message }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { currentUser } = useUserStore();

  const isMe = message.senderId._id === currentUser?._id;

  const bubbleBg = isMe
    ? colors.primary
    : colorScheme === "dark"
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(0, 0, 0, 0.04)";

  const avatarBorder = colorScheme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)";

  return (
    <View
      style={[
        styles.container,
        { flexDirection: isMe ? "row-reverse" : "row" },
      ]}
    >
      <Image 
        source={{ uri: message.senderId.image }} 
        style={[styles.avatar, { borderColor: avatarBorder }]} 
      />
      <View
        style={[
          styles.bubbleWrapper,
          { alignItems: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        <Text style={[styles.senderName, { color: colors.textMuted, marginLeft: isMe ? 0 : 4, marginRight: isMe ? 4 : 0 }]}>
          {message.senderId.name}
        </Text>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: bubbleBg,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderBottomLeftRadius: isMe ? 16 : 4,
              borderBottomRightRadius: isMe ? 4 : 16,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isMe ? "white" : colors.text },
            ]}
          >
            {message.message}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 16,
    width: "100%",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  bubbleWrapper: {
    flex: 1,
    gap: 2,
  },
  senderName: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
    letterSpacing: -0.1,
  },
});

export default Chat;
