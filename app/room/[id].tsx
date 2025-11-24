import { Colors } from "@/constants/Colors";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
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
  const { isJoined, joinRoom, socket, connectSocket, disconnectSocket } =
    useSocketStore();

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
  }, [currentUser, id, joinRoom, isJoined]);

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

  // TODO: Make a "No Room Found" component
  if (!currentRoom) return null;

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <ChatHeader room={currentRoom!} />
      <CurrentlyBroadcastSong />
      <ChatSection messages={currentRoom!.messages} />
      <ChatInput />
    </SafeAreaView>
  );
};

export default RoomScreen;
