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

  return (
    <View
      style={[
        styles.container,
        { flexDirection: isMe ? "row-reverse" : "row" },
      ]}
    >
      <Image source={{ uri: message.senderId.image }} style={styles.avatar} />
      <View
        style={[
          styles.bubbleWrapper,
          { alignItems: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        <Text style={[styles.senderName, { color: colors.textMuted }]}>
          {message.senderId.name}
        </Text>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isMe
                ? colors.primary
                : "rgba(255, 255, 255, 0.08)",
              borderBottomLeftRadius: isMe ? 20 : 4,
              borderBottomRightRadius: isMe ? 4 : 20,
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
    gap: 10,
    marginBottom: 16,
    width: "100%",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  bubbleWrapper: {
    flex: 1,
    gap: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: "85%",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
  },
});

export default Chat;
