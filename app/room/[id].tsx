import { Button, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { CoffeeIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatHeader from "./_components/chat-header";
import ChatInput from "./_components/chat-input";
import ChatSection from "./_components/chat-section";
import CurrentlyBroadcastSong from "./_components/currently-broadcast-song";

const RoomScreen = () => {
  const id = useLocalSearchParams().id as string;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { getRoomById, currentRoom, fetchingRoom } = useRoomStore();
  const { currentUser } = useUserStore();
  const { isJoined, joinRoom, socket, connectSocket } = useSocketStore();

  useEffect(() => {
    getRoomById(id as string);
  }, [id]);

  useEffect(() => {
    if (!socket && currentUser) {
      connectSocket(currentUser?._id);
    }
  }, [currentUser, connectSocket]);

  useEffect(() => {
    if (currentUser && id && !isJoined) {
      joinRoom(currentUser._id, id);
    }
  }, [currentUser, id]);

  if (fetchingRoom)
    return (
      <View
        style={{ backgroundColor: colors.background }}
        className="flex flex-1 justify-center items-center"
      >
        <ActivityIndicator
          size={"large"}
          color={colors.primary}
          animating={fetchingRoom}
        />
      </View>
    );

  if (!currentRoom && !fetchingRoom) return <NoRoomFound />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1">
        <ChatHeader room={currentRoom!} />
        <CurrentlyBroadcastSong />
        <ChatSection messages={currentRoom!.messages} />
        <ChatInput />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RoomScreen;

const NoRoomFound = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();
  return (
    <View className="flex-1 flex-col gap-4 items-center justify-center">
      <CoffeeIcon color={colors.icon} />

      <Text style={{ color: colors.text }}>Not Found.</Text>
      <Text style={{ color: colors.textMuted }}>Join a room now!</Text>
      <Button
        onPress={() => router.push("/rooms")}
        variant="solid"
        style={{ backgroundColor: colors.primary }}
      >
        <ButtonText>Join Room</ButtonText>
      </Button>
    </View>
  );
};
