import { Colors } from "@/constants/Colors";
import useRoomStore from "@/store/useRoomStore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ChatHeader from "./_components/chat-header";
import CurrentlyBroadcastSong from "./_components/currently-broadcast-song";

const RoomScreen = () => {
  const id = useLocalSearchParams().id;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom } = useSafeAreaInsets();

  const { getRoomById, currentRoom, isLoading } = useRoomStore();

  useEffect(() => {
    getRoomById(id as string);
  }, [id]);

  if (isLoading)
    return (
      <View
        style={{ backgroundColor: colors.background }}
        className="flex flex-1 justify-center items-center"
      >
        <ActivityIndicator
          size={"large"}
          color={colors.primary}
          animating={isLoading}
        />
      </View>
    );

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <ChatHeader room={currentRoom!} />
      <CurrentlyBroadcastSong />
    </SafeAreaView>
  );
};

export default RoomScreen;
