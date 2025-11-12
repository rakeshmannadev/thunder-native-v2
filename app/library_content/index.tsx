import AlbumItem from "@/components/album/AlbumItem";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";
import { Song } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { PlayIcon, RadioIcon, Shuffle } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const index = () => {
  const { bottom, top } = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const pagename = params.pagename as string;

  const { isLoading, currentUser, favoriteSongs, getFavoriteSongs } =
    useUserStore();
  const { playAlbum, setShuffle } = usePlayerStore();

  useEffect(() => {
    if (currentUser) {
      switch (pagename) {
        case "liked":
          if (favoriteSongs.length === 0) getFavoriteSongs();
          break;
        case "downloaded":
          // Handle downloaded songs if needed
          break;
        default:
          break;
      }
    }
  }, [pagename, currentUser]);

  const songs: Song[] = pagename === "liked" ? favoriteSongs : [];

  const handlePlay = () => {
    if (songs.length === 0) return;
    setShuffle(false);
    playAlbum(songs, 0);
  };
  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    setShuffle(true);
    playAlbum(songs, Math.floor(Math.random() * songs.length));
  };
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* --- Background Section --- */}
      {/* <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={StyleSheet.absoluteFillObject}
      />
      {!isLoading && <GradientBackground imageUrl={songs[0]?.imageUrl} />} */}
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: screenPadding.horizontal,
        }}
        showsVerticalScrollIndicator={true}
      >
        {/* --- Album Header Section --- */}
        <View style={[styles.headerSection, { marginTop: top }]}>
          <View style={styles.artworkContainer}>
            {isLoading ? (
              <Skeleton variant="sharp" />
            ) : (
              <Image
                source={{
                  uri: songs[0]?.imageUrl,
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
                numberOfLines={1}
                className="text-2xl"
              >
                {pagename ?? "Unknown Album"}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
                numberOfLines={1}
              >
                {songs?.map(
                  (a) =>
                    a.artists.primary.map((artist) => artist.name).join(", ") ??
                    ""
                )}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-10 h-4" />
            ) : (
              <ThemedText style={styles.songCount}>
                {songs.length ?? 0} Songs
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-32 h-8" />
            ) : (
              <View style={styles.controls}>
                <Pressable onPress={() => null} style={styles.iconButton}>
                  <RadioIcon size={20} color={colors.text} />
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
                  <ButtonText style={{ color: colors.text }}>Play</ButtonText>
                  <ButtonIcon as={PlayIcon} color={colors.text} size="lg" />
                </Button>

                <Pressable
                  onPress={handleShufflePlay}
                  style={styles.iconButton}
                >
                  <Shuffle size={22} color={colors.icon} />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* --- Tracklist Section --- */}
        <View style={{ paddingBottom: bottom + 50 }}>
          <FlatList
            data={songs ?? []}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: song }) => (
              <AlbumItem isLoading={isLoading} song={song} />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: 20,
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
  },
  title: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  artist: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    marginVertical: 6,
  },
  songCount: {
    ...defaultStyles.text,
    fontSize: 14,
    opacity: 0.7,
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
});
