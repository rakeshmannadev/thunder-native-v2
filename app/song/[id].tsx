import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import AlbumItem from "@/components/album/AlbumItem";
import GradientBackground from "@/components/GradientBackground";
import { ThemedText } from "@/components/ThemedText";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import {
  EllipsisVertical,
  HeartIcon,
  PlayCircleIcon,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SongScreen = () => {
  const { fetchSingle, isLoading, single } = useMusicStore();
  const { favoriteSongs, addToFavorite } = useUserStore();
  const { bottom, top } = useSafeAreaInsets();
  const { id }: { id: string } = useLocalSearchParams();

  useEffect(() => {
    fetchSingle(id);
  }, [id, fetchSingle]);

  const handleAddToFavorite = () => {
    if (!single) return;
    addToFavorite(
      single.artists.primary,
      single.imageUrl,
      single.audioUrl,
      single.albumId,
      single.artistId,
      single.duration,
      single.releaseYear,
      single._id,
      single.songId,
      single.title,
      "Favorites"
    );
  };

  let isAlreadyfavorite: boolean = false;

  favoriteSongs.map((song) => {
    if (song?.songId == id) {
      isAlreadyfavorite = true;
    }
  });
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={["#0F2027", "#203A43", "#2C5364"]}
      >
        {!isLoading && <GradientBackground imageUrl={single?.imageUrl} />}

        {/* --- Album Header Section --- */}
        <View style={[styles.headerSection, { marginTop: top + 36 }]}>
          <View style={styles.artworkContainer}>
            {isLoading ? (
              <Skeleton variant="sharp" />
            ) : (
              <Image
                source={{
                  uri: single?.imageUrl,
                }}
                style={styles.artwork}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={styles.infoContainer}>
            {isLoading ? (
              <SkeletonText _lines={1} className="w-20 h-4" />
            ) : (
              <ThemedText style={styles.title}>
                {single?.title ?? "Unknown Album"}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText style={styles.artist}>
                {single?.artists.primary.map((a) => a.name).join(", ") ?? ""}
              </ThemedText>
            )}

            <View style={styles.controls}>
              <Pressable onPress={() => null} style={styles.iconButton}>
                <HeartIcon
                  size={20}
                  fill={isAlreadyfavorite ? "green" : "none"}
                  color={isAlreadyfavorite ? "green" : colors.icon}
                />
              </Pressable>

              <Pressable onPress={() => null} style={styles.iconButton}>
                <PlayCircleIcon size={22} color={colors.icon} />
              </Pressable>

              <Pressable style={styles.iconButton}>
                <EllipsisVertical size={22} color={colors.icon} />
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottom + 40 },
          ]}
        >
          {/* Song lists */}
          <View className="mt-5">
            {single && <AlbumItem isLoading={isLoading} song={single} />}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
    padding: screenPadding.horizontal,
  },
  overlayContainer: {
    ...defaultStyles.container,

    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  artworkContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: 20,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  title: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  artist: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    marginVertical: 6,
  },
  trackPlayingIconIndicator: {
    position: "absolute",
    top: 18,
    left: 16,
    width: 16,
    height: 16,
  },
  trackPausedIndicator: {
    position: "absolute",
    top: 14,
    left: 14,
  },
  trackTitleText: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  trackArtistText: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    maxWidth: "90%",
  },
});
export default SongScreen;
