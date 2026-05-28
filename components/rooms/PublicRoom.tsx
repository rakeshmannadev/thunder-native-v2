import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const PublicRoom = ({ room }: { room: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { joinPublicRoom } = useRoomStore();
  const { rooms, currentUser } = useUserStore();
  const { sendJoinRequest } = useSocketStore();
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (room.visability === "public") {
      await joinPublicRoom(room._id);
    } else if (currentUser && room.visability === "private") {
      sendJoinRequest(currentUser?._id, room._id);
    }
  };
  const isJoined = rooms.some((r) => r._id === room._id);
  return (
    <TouchableOpacity
      activeOpacity={isJoined ? 0.85 : 1}
      onPress={isJoined ? () => router.push(`/room/${room.roomId}`) : undefined}
      style={{
        backgroundColor: colors.secondaryBackground,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
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
          gap: 12,
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
              source={{ uri: room.image }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                backgroundColor: colors.card,
              }}
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
                {room.participants.length} {room.participants.length === 1 ? "listener" : "listeners"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleJoinRoom}
          disabled={isJoined}
          activeOpacity={0.8}
          style={{
            backgroundColor: isJoined ? "transparent" : colors.primary,
            borderWidth: isJoined ? 1.5 : 0,
            borderColor: colors.borderColor,
            paddingHorizontal: isJoined ? 12 : 20,
            paddingVertical: 10,
            borderRadius: 12,
            minWidth: 84,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 4,
          }}
        >
          {isJoined && <Check size={14} color={colors.textMuted} strokeWidth={3} />}
          <Text
            style={{
              color: isJoined ? colors.textMuted : "white",
              fontWeight: "800",
              fontSize: 13,
              letterSpacing: -0.1,
            }}
          >
            {isJoined ? "Joined" : "Join"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PublicRoom;
