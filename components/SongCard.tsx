import { Colors } from "@/constants/Colors";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Song } from "../types/index";
import PlayButton from "./songs/PlayButton";
import { ThemedText } from "./ThemedText";
import { Skeleton, SkeletonText } from "./ui/skeleton";

const SongCard = React.memo(
  ({ song, isLoading }: { song: Song; isLoading: boolean }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];

    const handlePress = () => {
      if (!isLoading && song?.id) {
        router.push(`../../song/${song.id}`);
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.card}
      >
        <View style={styles.imageWrapper}>
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-2xl" />
          ) : (
            <>
              <Image
                source={resolveImageSource(
                  song.image[song.image.length - 1].link,
                  "track"
                )}
                style={styles.image}
                alt="song-cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
                style={styles.overlay}
              />
            </>
          )}
          {!isLoading && (
            <View style={styles.playButtonContainer}>
              <PlayButton song={song} />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          {isLoading ? (
            <View style={styles.skeletonContainer}>
              <SkeletonText className="w-24 h-4 mb-2" />
              <SkeletonText className="w-16 h-3" />
            </View>
          ) : (
            <>
              <ThemedText style={styles.songName} numberOfLines={1}>
                {song.name}
              </ThemedText>
              <ThemedText
                style={[styles.artistName, { color: colors.textMuted }]}
                numberOfLines={1}
              >
                {song.artist_map
                  ? song.artist_map?.primary_artists
                      ?.map((artist) => artist.name)
                      .join(", ")
                  : "Unknown Artist"}
              </ThemedText>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    width: 156,
    marginRight: 16,
    marginBottom: 8,
  },
  imageWrapper: {
    width: 156,
    height: 156,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.05)",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playButtonContainer: {
    position: "absolute",
    bottom: -22, // Adjusted for the redesigned FAB position
    right: -15,
    transform: [{ scale: 0.85 }], // Slightly scale down for card context
  },
  infoContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  songName: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  artistName: {
    fontSize: 13,
    fontWeight: "600",
  },
  skeletonContainer: {
    marginTop: 8,
  },
});

export default SongCard;
