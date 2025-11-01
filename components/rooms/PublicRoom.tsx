import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";

const PublicRoom = () => {
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
              source={require("../../assets/images/icon.png")}
              style={{ width: 40, height: 40, borderRadius: borderRadius.md }}
            />
            <View>
              <ThemedText type="subtitle" numberOfLines={1}>
                Chill-time
              </ThemedText>
              <Text style={{ color: colors.textMuted }} numberOfLines={1}>
                Hosted by: @lord_rakesh
              </Text>
              <Text style={{ color: colors.textMuted }} numberOfLines={1}>
                20 Listeners
              </Text>
            </View>
          </View>
          <View>
            <Button
              variant="solid"
              action="primary"
              style={{ borderRadius: borderRadius.lg }}
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
