import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";

const JoinedRoom = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <Card
      variant="outline"
      className="min-w-full p-2 rounded-2xl mb-3 "
      style={{ backgroundColor: colors.component }}
    >
      <Link href={"/"}>
        <View className="flex-row w-full px-2 items-center justify-between">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={{ width: 40, height: 40, borderRadius: borderRadius.md }}
            />
            <View>
              <ThemedText type="subtitle">Chill-time</ThemedText>
              <Text style={{ color: colors.textMuted }}>
                Hosted by: @lord_rakesh
              </Text>
              <Text style={{ color: colors.textMuted }}>20 Listeners</Text>
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
