import { MovingText } from "@/components/songs/useMovingText";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
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
import StandByScreen from "./stand-by-screen";

const CurrentlyBroadcastSong = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top } = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);

  const { isBroadcasting, startBroadcast, currentJockey, isPlayingSong } =
    useSocketStore();
  const { currentSong } = usePlayerStore();

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
        {isBroadcasting && isPlayingSong && currentSong ? (
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
                Broadcasting by: {currentJockey?.name}
              </Text>
              <MovingText
                text={currentSong?.title}
                animationThreshold={25}
                style={{ fontSize: 16, color: colors.text, lineHeight: 24 }}
              />

              {expanded && (
                <MovingText
                  animationThreshold={25}
                  text={`Artist:${currentSong.artists.primary.join(
                    ", "
                  )} Year: ${currentSong.releaseYear}`}
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
                  uri: currentSong.imageUrl,
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
        ) : isBroadcasting && !isPlayingSong ? (
          <StandByScreen />
        ) : (
          <NoBroadCastScreen expanded={expanded} setExpanded={setExpanded} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CurrentlyBroadcastSong;
