import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize } from "@/constants/tokens";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
import { playSong } from "@/hooks/useTrackPlayerActions";
import { Song } from "@/types";
import { Image } from "expo-image";
import { LucidePlayCircle } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Skeleton, SkeletonText } from "./ui/skeleton";

const RecentlyPlayedCard = React.memo(
  ({ song, isLoading }: { song: Song; isLoading: boolean }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];

    const handlePress = useCallback(async () => {
      if (song) {
        await playSong(song);
      }
    }, [song]);

    if (isLoading) {
      return (
        <View style={styles.container}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.borderColor,
              },
            ]}
          >
            <Skeleton
              variant="rounded"
              className="w-[50px] h-[50px] rounded-md bg-background-200"
            />
            <View style={styles.content}>
              <SkeletonText className="w-28 h-4 mb-2 bg-background-200" />
              <SkeletonText className="w-16 h-3 mb-2 bg-background-200" />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <Skeleton
                  variant="circular"
                  className="w-[14px] h-[14px] bg-background-200"
                />
                <SkeletonText className="w-24 h-3 bg-background-200" />
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.container}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderColor,
            },
          ]}
        >
          <Image
            source={resolveImageSource(
              song.image[song.image.length - 1].link,
              "track"
            )}
            style={styles.artwork}
            contentFit="cover"
          />
          <View style={styles.content}>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: colors.text }]}
            >
              {song.name}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.artist, { color: colors.textMuted }]}
            >
              {song.artist_map.primary_artists
                .map((artist) => artist.name)
                .join(", ")}
            </Text>
            <View style={styles.footer}>
              <LucidePlayCircle size={14} color={colors.primary} />
              <Text style={[styles.footerText, { color: colors.primary }]}>
                RESUME LISTENING
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  card: {
    width: 240,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    // Subtle shadow for premium feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xs + 2,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  artist: {
    fontSize: fontSize.xs - 1,
    fontWeight: "500",
    marginTop: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  footerText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
});

export default RecentlyPlayedCard;
