import { Colors } from "@/constants/Colors";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Alert,
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
      activeOpacity={0.85}
      onPress={handleVisitRoom}
      style={{
        backgroundColor: colors.secondaryBackground,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor:
          colorScheme === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.04)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: colorScheme === "dark" ? 0.2 : 0.04,
        shadowRadius: 12,
        elevation: 3,
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
          <View style={{ position: "relative" }}>
            <Image
              source={room.image}
              style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                backgroundColor: colors.card,
              }}
              contentFit="cover"
            />
            {/* Live indicator dot on cover art */}
            <View
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: colors.primary,
                borderWidth: 2.5,
                borderColor: colors.secondaryBackground,
              }}
            />
          </View>

          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.text,
                marginBottom: 4,
                letterSpacing: -0.3,
              }}
              numberOfLines={1}
            >
              {room.roomName}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <View
                style={{
                  backgroundColor: colors.primary + "15",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 10,
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {room.visability}
                </Text>
              </View>
              <View
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: colors.textMuted,
                  opacity: 0.4,
                }}
              />
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  fontWeight: "600",
                  letterSpacing: -0.1,
                }}
              >
                {room.participants.length}{" "}
                {room.participants.length === 1 ? "listener" : "listeners"}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(0, 0, 0, 0.03)",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor:
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.02)"
                : "rgba(0, 0, 0, 0.01)",
          }}
        >
          <ChevronRight size={18} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default JoinedRoom;
