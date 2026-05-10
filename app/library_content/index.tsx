import AlbumItem from "@/components/album/AlbumItem";
import PlayButton from "@/components/PlayButton";
import PlaylistCard from "@/components/PlaylistCard";
import { ThemedText } from "@/components/ThemedText";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { resolveImage } from "@/helpers/resolverImageUrl";
import { playAlbum } from "@/hooks/useTrackPlayerActions";
import { getFavoriteSongs, getPlaylists } from "@/services/userServices";
import usePlayerStore from "@/store/usePlayerStore";
import { Playlist, Song } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Shuffle } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 380;

const LibraryContentScreen = () => {
  const { bottom, top } = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const pagename = params.pagename as string;

  const { setShuffle } = usePlayerStore();
  const scrollY = useSharedValue(0);
  const queryClient = useQueryClient();

  const { data: favoriteSongs, isLoading: favoritesLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavoriteSongs,
    enabled: pagename === "liked",
  });

  const { data: userPlaylists, isLoading: playlistsLoading } = useQuery({
    queryKey: ["user-playlist"],
    queryFn: getPlaylists,
    enabled: pagename === "playlists",
  });

  const songs: Song[] = pagename === "liked" ? favoriteSongs || [] : [];
  const playlists: Playlist[] =
    pagename === "playlists" ? userPlaylists || [] : [];

  const isPlaylistMode = pagename === "playlists";
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

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT - 100], [1, 0]),
      transform: [
        {
          scale: interpolate(scrollY.value, [-100, 0], [1.1, 1], "clamp"),
        },
      ],
    };
  });

  const title = pagename
    ? pagename.charAt(0).toUpperCase() + pagename.slice(1)
    : "Collection";
  const headerImage =
    songs.length > 0
      ? resolveImage(songs[0]?.image?.[0]?.link)
      : playlists.length > 0
        ? resolveImage(playlists[0]?.imageUrl)
        : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Background/Header Image */}
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        {headerImage ? (
          <Image source={{ uri: headerImage }} style={styles.headerImage} />
        ) : (
          <View
            style={[
              styles.headerImage,
              { backgroundColor: colors.secondaryBackground },
            ]}
          />
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)", colors.background]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={[styles.backButton, { top: top + 10, left: 8 }]}
      >
        {/* <ArrowLeft color="white" size={24} /> */}
      </Pressable>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT - 60,
          paddingBottom: bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
              {isPlaylistMode
                ? `${playlists.length} Playlists`
                : `${songs.length} Songs`}{" "}
              • Thunder Collection
            </ThemedText>

            {!isPlaylistMode && (
              <View style={styles.actionRow}>
                <PlayButton
                  handlePlay={handlePlay}
                  title="Play All"
                  color={colors.primary}
                />

                <Pressable
                  onPress={handleShufflePlay}
                  style={[
                    styles.shuffleButton,
                    { backgroundColor: colors.secondaryBackground },
                  ]}
                >
                  <Shuffle color={colors.text} size={22} />
                </Pressable>
              </View>
            )}
          </Animated.View>

          <View style={styles.listContainer}>
            {(isPlaylistMode ? playlistsLoading : favoritesLoading) ? (
              Array.from({ length: 8 }).map((_, i) => (
                <View key={i} style={styles.skeletonItem}>
                  <Skeleton className="w-14 h-14 rounded-lg" />
                  <View style={{ flex: 1, gap: 8 }}>
                    <SkeletonText className="w-40 h-4" />
                    <SkeletonText className="w-24 h-3" />
                  </View>
                </View>
              ))
            ) : isPlaylistMode ? (
              <FlatList
                data={playlists}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item: playlist, index }) => (
                  <Animated.View
                    entering={FadeInDown.delay(300 + index * 50).duration(400)}
                    style={{ width: "48%" }}
                  >
                    <PlaylistCard playlist={playlist} isLoading={false} />
                  </Animated.View>
                )}
              />
            ) : (
              <FlatList
                data={songs}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item: song, index }) => (
                  <Animated.View
                    entering={FadeInDown.delay(300 + index * 50).duration(400)}
                  >
                    <AlbumItem song={song} isLoading={false} />
                  </Animated.View>
                )}
              />
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    width: width,
    height: HEADER_HEIGHT,
    zIndex: 0,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    left: screenPadding.horizontal,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    paddingHorizontal: screenPadding.horizontal,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "white",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  playButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  playButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  shuffleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    marginTop: 8,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});

export default LibraryContentScreen;
