import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { Room } from "@/types";
import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";

const JoinedRoom = ({ room }: { room: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <Card
      variant="outline"
      className="min-w-full p-2 rounded-2xl mb-3 "
      style={{ backgroundColor: colors.component }}
    >
      <Link href={{ pathname: "/room/[id]", params: { id: room.roomId } }}>
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
      </Link>
    </Card>
  );
};

export default JoinedRoom;
