import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import AlbumItem from "@/components/album/AlbumItem";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";
import { useLocalSearchParams } from "expo-router";
import { HeartIcon, PlayIcon, RadioIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SongScreen = () => {
  const { bottom, top } = useSafeAreaInsets();
  const { id }: { id: string } = useLocalSearchParams();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { fetchSingle, isLoading, single } = useMusicStore();
  const { favoriteSongs, addToFavorite } = useUserStore();
  const { playAlbum } = usePlayerStore();

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

  const handlePlay = () => {
    if (!single) return;
    playAlbum([single], 0);
  };
  let isAlreadyfavorite: boolean = false;

  favoriteSongs.map((song) => {
    if (song?.songId == id) {
      isAlreadyfavorite = true;
    }
  });
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottom + 40 },
        ]}
      >
        {/* --- Album Header Section --- */}
        <View style={[styles.headerSection, { marginTop: top }]}>
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
              <ThemedText
                style={[styles.title, { color: colors.text }]}
                className="text-2xl"
              >
                {single?.title ?? "Unknown Album"}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
              >
                {single?.artists.primary.map((a) => a.name).join(", ") ?? ""}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-32 h-8" />
            ) : (
              <View style={styles.controls}>
                <Pressable
                  onPress={handleAddToFavorite}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.component },
                  ]}
                >
                  <HeartIcon
                    size={20}
                    fill={isAlreadyfavorite ? "green" : "none"}
                    color={isAlreadyfavorite ? "green" : colors.icon}
                  />
                </Pressable>

                <Button
                  variant="solid"
                  size="xl"
                  onPress={handlePlay}
                  style={{
                    paddingHorizontal: 12,
                    borderRadius: borderRadius.lg,
                    backgroundColor: colors.primary,
                    flex: 1,
                  }}
                >
                  <ButtonText style={{ color: "white" }}>Play</ButtonText>
                  <ButtonIcon as={PlayIcon} color={"white"} size="lg" />
                </Button>

                <Pressable
                  onPress={() => null}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.component },
                  ]}
                >
                  <RadioIcon size={22} color={colors.icon} />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Song lists */}
        <View className="mt-5">
          {single && <AlbumItem isLoading={isLoading} song={single} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    marginTop: 30,
  },
  overlayContainer: {
    ...defaultStyles.container,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerSection: {
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  artworkContainer: {
    width: 280,
    height: 280,

    overflow: "hidden",
    elevation: 6,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.lg,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
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
