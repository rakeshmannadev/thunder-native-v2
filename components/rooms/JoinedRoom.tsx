import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Alert, Image, Text, useColorScheme, View } from "react-native";

const JoinedRoom = ({ room }: { room: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { isJoined, roomId, leaveRoom } = useSocketStore();
  const { currentUser } = useUserStore();
  const router = useRouter();

  const handleVisitRoom = async () => {
    if (!room.roomId) return;

    if (roomId !== room.roomId && isJoined) {
      Alert.alert(
        "Already in a room",
        "You are already in another room. Do you want to leave the current room and join this one?",
        [
          {
            text: "Return",
            onPress: () => {
              router.push(`/room/${roomId}`);
            },
            style: "cancel",
          },
          {
            text: "Leave & Join",
            onPress: () => {
              leaveRoom(roomId, currentUser?._id as string);
              router.push(`/room/${room.roomId}`);
            },
            style: "default",
          },
        ]
      );
      return;
    }
    // navigate to room
    router.push(`/room/${room.roomId}`);
  };

  return (
    <Card
      variant="outline"
      className="min-w-full p-2 rounded-2xl mb-3 "
      style={{ backgroundColor: colors.component }}
      onTouchEnd={handleVisitRoom}
    >
      <View className="flex-row w-full px-2 items-center justify-between">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Image
            source={{ uri: room.image }}
            style={{
              width: 60,
              borderRadius: borderRadius.md,
              aspectRatio: 1,
            }}
          />
          <View>
            <ThemedText type="subtitle">{room.roomName}</ThemedText>
            <Text style={{ color: colors.textMuted }}>
              {room.visability.charAt(0).toUpperCase() +
                room.visability.slice(1)}
            </Text>
            <Text style={{ color: colors.textMuted }}>
              {room.participants.length} Listeners
            </Text>
          </View>
        </View>
        <View>
          <ChevronRight size={24} color={colors.text} />
        </View>
      </View>
    </Card>
  );
};

export default JoinedRoom;
