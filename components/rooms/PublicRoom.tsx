import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
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

  const handleJoinRoom = async () => {
    if (room.visability === "public") {
      await joinPublicRoom(room._id);
    } else if (currentUser && room.visability === "private") {
      sendJoinRequest(currentUser?._id, room._id);
    }
  };
  const isJoined = rooms.some((r) => r._id === room._id);
  return (
    <View
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
              style={{ fontSize: 17, fontWeight: "800", marginBottom: 2 }}
              numberOfLines={1}
            >
              {room.roomName}
            </ThemedText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.textMuted,
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

        <TouchableOpacity
          onPress={handleJoinRoom}
          disabled={isJoined}
          style={{
            backgroundColor: isJoined
              ? "rgba(255, 255, 255, 0.05)"
              : colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            minWidth: 80,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: isJoined ? colors.textMuted : "white",
              fontWeight: "800",
              fontSize: 14,
            }}
          >
            {isJoined ? "Joined" : "Join"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PublicRoom;
