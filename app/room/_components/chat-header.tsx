import { Button, ButtonIcon } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import { Room } from "@/types";
import { MoreHorizontal } from "lucide-react-native";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChatHeader = ({ room }: { room: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom, left } = useSafeAreaInsets();

  if (!room) return null;
  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: screenPadding.horizontal,
        paddingLeft: left + 50,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {/* Room image section */}
      <Image
        source={{ uri: room.image }}
        style={{
          width: 40,
          //   margin: 16,
          borderRadius: borderRadius.lg,
          aspectRatio: 1,
        }}
      />
      {/* Room name section */}
      <View style={{ alignItems: "center", paddingRight: 8 }}>
        <Text
          style={{
            fontSize: fontSize.base,
            fontWeight: "bold",
            color: colors.text,
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {room.roomName}
        </Text>
      </View>
      <View style={{ paddingRight: 12 }}>
        <Button variant="link" focusable action="primary">
          <ButtonIcon as={MoreHorizontal} size={"md"} color={colors.text} />
        </Button>
      </View>
    </View>
  );
};

export default ChatHeader;
