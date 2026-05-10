import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

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
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleVisitRoom}
      style={{
        backgroundColor: colors.secondaryBackground,
        borderRadius: 24,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            flex: 1,
          }}
        >
          <Image
            source={{ uri: room.image }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          />
          <View style={{ flex: 1 }}>
            <ThemedText
              style={{ fontSize: 18, fontWeight: "800", marginBottom: 2 }}
            >
              {room.roomName}
            </ThemedText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  backgroundColor:
                    room.visability === "public"
                      ? "rgba(29, 185, 84, 0.1)"
                      : "rgba(255, 255, 255, 0.05)",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color:
                      room.visability === "public"
                        ? "#1DB954"
                        : colors.textMuted,
                    fontSize: 11,
                    fontWeight: "800",
                    textTransform: "uppercase",
                  }}
                >
                  {room.visability}
                </Text>
              </View>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.textMuted,
                  opacity: 0.5,
                }}
              />
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {room.participants.length} Listeners
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.03)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronRight size={20} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default JoinedRoom;
