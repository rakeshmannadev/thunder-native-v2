import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";

const PublicRoom = ({ room }: { room: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { joinPublicRoom } = useRoomStore();
  const { rooms, currentUser } = useUserStore();
  const { sendJoinRequest } = useSocketStore();

  const handleJoinRoom = async () => {
    if (room.visability === "public") {
      await joinPublicRoom(room._id);
    } else if (currentUser && room.visability === "private") {
      sendJoinRequest(currentUser?._id, room._id);
    }
  };
  const isJoined = rooms.some((r) => r._id === room._id);
  return (
    <Card
      variant="outline"
      className="min-w-full p-2 mb-3 "
      style={{
        backgroundColor: colors.component,
        borderRadius: borderRadius.lg,
      }}
    >
      <View className="flex-row w-full px-2 items-center justify-between">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Image
            source={{ uri: room.image }}
            style={{
              width: 60,
              aspectRatio: 1,
              borderRadius: borderRadius.md,
            }}
          />
          <View>
            <ThemedText type="subtitle" numberOfLines={1}>
              {room.roomName}
            </ThemedText>
            <Text style={{ color: colors.textMuted }} numberOfLines={1}>
              {room.visability.charAt(0).toUpperCase() +
                room.visability.slice(1)}
            </Text>
            <Text style={{ color: colors.textMuted }} numberOfLines={1}>
              {room.participants.length} Listeners
            </Text>
          </View>
        </View>
        <View>
          <Button
            variant="solid"
            action="primary"
            style={{
              borderRadius: borderRadius.lg,
              backgroundColor: !isJoined ? colors.primary : colors.textMuted,
            }}
            onPress={handleJoinRoom}
            disabled={isJoined}
          >
            <ButtonText>{isJoined ? "Joined" : "Join"}</ButtonText>
          </Button>
        </View>
      </View>
    </Card>
  );
};

export default PublicRoom;
