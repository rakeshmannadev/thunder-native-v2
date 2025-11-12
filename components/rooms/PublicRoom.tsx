import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { Room } from "@/types";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";

const PublicRoom = ({ room }: { room: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <Card
      variant="outline"
      className="min-w-full p-2 mb-3 "
      style={{
        backgroundColor: colors.component,
        borderRadius: borderRadius.lg,
      }}
    >
      <Link href={"/"}>
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
                backgroundColor: colors.primary,
              }}
            >
              <ButtonText>Join</ButtonText>
            </Button>
          </View>
        </View>
      </Link>
    </Card>
  );
};

export default PublicRoom;
