import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { Message } from "@/types";
import React, { useEffect, useRef } from "react";
import { FlatList, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Chat from "./chat";
import NoChatScreen from "./no-chat-screen";

const ChatSection = ({ messages }: { messages: Message[] }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top } = useSafeAreaInsets();
  const messageRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    console.log("messageRef: ", messageRef);
    messageRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (messages.length === 0) return <NoChatScreen />;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: top,
        // paddingBottom: bottom,
        backgroundColor: colors.background,
        paddingHorizontal: screenPadding.horizontal,
      }}
    >
      <FlatList
        ref={messageRef}
        data={messages}
        renderItem={({ item }) => <Chat message={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ChatSection;
