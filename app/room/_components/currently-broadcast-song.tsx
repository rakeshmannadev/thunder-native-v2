import { MovingText } from "@/components/songs/useMovingText";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import useSocketStore from "@/store/useSocketStore";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NoBroadCastScreen from "./no-broadcast-screen";

const CurrentlyBroadcastSong = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top } = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);

  const { isBroadcasting } = useSocketStore();

  return (
    <View
      style={{
        paddingHorizontal: screenPadding.horizontal,
        paddingTop: top,
        paddingBottom: 2,
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: borderRadius.lg,
          backgroundColor: colors.secondaryBackground,
          padding: 16,
        }}
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
      >
        {isBroadcasting ? (
          <View className="flex flex-row items-center justify-between gap-4">
            <View
              className="flex flex-col gap-1 overflow-hidden"
              style={{ maxWidth: expanded ? "55%" : "70%" }}
            >
              <Text
                style={{ color: colors.accent }}
                className="text-lg font-normal leading-normal"
                numberOfLines={1}
              >
                Broadcasting by: @dj_vibes
              </Text>
              <MovingText
                text="Jo beji thi dua sdfhd fdfgdgf afsdgdf"
                animationThreshold={25}
                style={{ fontSize: 16, color: colors.text, lineHeight: 24 }}
              />

              {expanded && (
                <MovingText
                  animationThreshold={25}
                  text="Artist: Kumar Sanu, Alka Yagnik Album: Agneepath (2012) Music: Ajay-Atul Lyrics: Amitabh Bhattacharya"
                  style={{
                    fontSize: 14,
                    color: colors.textMuted,
                    lineHeight: 20,
                  }}
                />
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <Image
                alt="album_art"
                style={{
                  width: expanded ? 120 : 40,
                  aspectRatio: 1,
                  borderRadius: borderRadius.md,
                }}
                source={{
                  uri: "https://c.saavncdn.com/317/Agneepath-Hindi-2011-20190603132941-500x500.jpg",
                }}
              />
              <Button
                onPress={() => setExpanded(!expanded)}
                size="sm"
                variant="link"
              >
                <ButtonIcon as={expanded ? ChevronUp : ChevronDown} size="xl" />
              </Button>
            </View>
          </View>
        ) : (
          <NoBroadCastScreen expanded={expanded} setExpanded={setExpanded} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CurrentlyBroadcastSong;
