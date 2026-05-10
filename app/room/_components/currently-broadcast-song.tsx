import { MovingText } from "@/components/songs/useMovingText";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { resolveImage } from "@/helpers/resolverImageUrl";
import useSocketStore from "@/store/useSocketStore";
import { Room } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useActiveTrack } from "react-native-track-player";
import NoBroadCastScreen from "./no-broadcast-screen";
import StandByScreen from "./stand-by-screen";

const CurrentlyBroadcastSong = ({ currentRoom }: { currentRoom: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const [expanded, setExpanded] = useState(false);

  const { isBroadcasting, startBroadcast, currentJockey, isPlayingSong } =
    useSocketStore();
  const currentSong = useActiveTrack();

  return (
    <View
      style={{
        paddingHorizontal: screenPadding.horizontal,
        paddingBottom: 8,
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
      >
        {isBroadcasting && currentSong ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.primary,
                  }}
                />
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 13,
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                  numberOfLines={1}
                >
                  {currentJockey?.name} is LIVE
                </Text>
              </View>

              <MovingText
                text={currentSong?.title || ""}
                animationThreshold={25}
                style={{
                  fontSize: 18,
                  color: colors.text,
                  fontWeight: "800",
                  letterSpacing: -0.5,
                }}
              />

              <MovingText
                animationThreshold={25}
                text={currentSong.artist || ""}
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  fontWeight: "600",
                }}
              />

              {expanded && (
                <View style={{ marginTop: 8, gap: 4 }}>
                  <ThemedText style={{ fontSize: 13, color: colors.textMuted }}>
                    Released: {currentSong.release_date}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={{ alignItems: "center", gap: 8 }}>
              <Image
                alt="album_art"
                style={{
                  width: expanded ? 100 : 56,
                  height: expanded ? 100 : 56,
                  borderRadius: 12,
                  backgroundColor: colors.secondaryBackground,
                }}
                source={{
                  uri: resolveImage(currentSong.artwork),
                }}
              />
              <Button
                onPress={() => setExpanded(!expanded)}
                size="sm"
                variant="link"
                style={{ height: 24 }}
              >
                <ButtonIcon
                  as={expanded ? ChevronUp : ChevronDown}
                  color={colors.textMuted}
                />
              </Button>
            </View>
          </View>
        ) : isBroadcasting && !isPlayingSong ? (
          <StandByScreen />
        ) : (
          <NoBroadCastScreen
            expanded={expanded}
            setExpanded={setExpanded}
            currentRoom={currentRoom}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CurrentlyBroadcastSong;
