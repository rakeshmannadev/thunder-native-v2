import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { Message } from "@/types";
import React, { useMemo } from "react";
import { FlatList, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Chat from "./chat";
import NoChatScreen from "./no-chat-screen";

const ChatSection = ({ messages }: { messages: Message[] }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top } = useSafeAreaInsets();

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  if (messages.length === 0) return <NoChatScreen />;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: top,
        backgroundColor: colors.background,
        paddingHorizontal: screenPadding.horizontal,
      }}
    >
      <FlatList
        data={reversedMessages}
        renderItem={({ item }) => <Chat message={item} />}
        keyExtractor={(item) => item._id}
        inverted
      />
    </View>
  );
};

export default ChatSection;
