import { ThemedText } from "@/components/ThemedText";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import React from "react";
import { ScrollView, useColorScheme } from "react-native";
import JoinedRoom from "../../../components/rooms/JoinedRoom";
import PublicRoom from "../../../components/rooms/PublicRoom";

const index = () => {
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <VStack
      style={{ backgroundColor: colors.background }}
      space="xl"
      className="mt-16 h-screen"
    >
      <ThemedText type="subtitle" className="pl-4">
        Public rooms
      </ThemedText>
      {/* Public rooms section */}
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={false}
        className=" px-3 min-h-fit "
      >
        <PublicRoom />
        <PublicRoom />
        <PublicRoom />
        <PublicRoom />
        <PublicRoom />
        <PublicRoom />
      </ScrollView>
      {/* Joined rooms section */}
      <ThemedText type="subtitle" className="pl-4">
        Joined rooms
      </ThemedText>
      <ScrollView className="p-3 ">
        <JoinedRoom />
        <JoinedRoom />
        <JoinedRoom />
        <JoinedRoom />
        <JoinedRoom />
        <JoinedRoom />
        <JoinedRoom />
        <JoinedRoom />
      </ScrollView>
    </VStack>
  );
};

export default index;
