import AlbumItem from "@/components/album/AlbumItem";
import EmptyContent from "@/components/EmptyContent";
import PlayButton from "@/components/PlayButton";
import PlaylistCard from "@/components/PlaylistCard";
import HeaderImageSkeleton from "@/components/skeleton/HeaderImageSkeleton";
import ShuffleButton from "@/components/songs/ShuffleButton";
import { ThemedText } from "@/components/ThemedText";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
import { playAlbum } from "@/hooks/useTrackPlayerActions";
import {
  getFavoriteSongs,
  getRecentlyPlayed,
  getSavedAlbums,
  getUserPlaylists,
} from "@/services/userServices";
import usePlayerStore from "@/store/usePlayerStore";
import { Playlist, Song } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, ListMusic } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  FlatList,
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

  const { data: favoriteSongs, isLoading: favoritesLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavoriteSongs,
    enabled: pagename === "liked",
  });

  const { data: savedAlbums, isLoading: albumsLoading } = useQuery({
    queryKey: ["saved-albums"],
    queryFn: getSavedAlbums,
    enabled: pagename === "albums",
  });
  const { data: recentlyPlayed, isLoading: recentlyPlayedLoading } = useQuery({
    queryKey: ["recently-played"],
    queryFn: getRecentlyPlayed,
    enabled: pagename === "recently_played",
  });
  const { data: userPlaylists, isLoading: userPlaylistsLoading } = useQuery({
    queryKey: ["user-playlists"],
    queryFn: getUserPlaylists,
    enabled: pagename === "playlists",
  });

  const songs: Song[] =
    pagename === "liked"
      ? favoriteSongs || []
      : pagename === "recently_played"
        ? recentlyPlayed || []
        : [];
  const playlists: Playlist[] =
    pagename === "albums"
      ? savedAlbums || []
      : pagename === "playlists"
        ? userPlaylists || []
        : [];

  const isPlaylistMode = pagename === "playlists" || pagename === "albums";
  const isLoading = isPlaylistMode
    ? pagename === "albums"
      ? albumsLoading
      : userPlaylistsLoading
    : pagename === "recently_played"
      ? recentlyPlayedLoading
      : favoritesLoading;
  const isEmpty =
    !isLoading &&
    (isPlaylistMode ? playlists.length === 0 : songs.length === 0);

  const handlePlay = () => {
    if (songs.length === 0) return;
    setShuffle(false);
    playAlbum(songs, 0);
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
    ? pagename === "recently_played"
      ? "Recently Played"
      : pagename === "liked"
        ? "Liked Songs"
        : pagename.charAt(0).toUpperCase() + pagename.slice(1)
    : "Collection";
  const headerImage =
    songs.length > 0
      ? resolveImageSource(songs[0]?.image?.at(-1)?.link, "track")
      : playlists.length > 0
        ? resolveImageSource(playlists[0]?.imageUrl, "artist")
        : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Background/Header Image */}
      {!isEmpty && (
        <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
          {headerImage ? (
            <Image
              source={headerImage}
              style={styles.headerImage}
              contentFit="cover"
            />
          ) : (
            <HeaderImageSkeleton />
          )}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)", colors.background]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* Back Button */}
      <View
        style={[
          styles.backButton,
          { top: top + 8, left: 8 },
          isEmpty && { backgroundColor: colors.iconBackground },
        ]}
      >
        {/* <ChevronLeft color={isEmpty ? colors.icon : "white"} size={24} /> */}
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: isEmpty ? top + 60 : HEADER_HEIGHT - 60,
          paddingBottom: bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {!isEmpty && (
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <ThemedText style={styles.title}>{title}</ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: colors.textMuted }]}
              >
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
                    songs={[
                      ...(isPlaylistMode
                        ? playlists.map((f) => f.songs).flat()
                        : []),
                      ...songs,
                    ]}
                  />

                  <ShuffleButton
                    songs={[
                      ...(isPlaylistMode
                        ? playlists.map((f) => f.songs).flat()
                        : []),
                      ...songs,
                    ]}
                  />
                </View>
              )}
            </Animated.View>
          )}

          <View style={styles.listContainer}>
            {isLoading ? (
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
              playlists.length > 0 ? (
                <FlatList
                  data={playlists}
                  keyExtractor={(item, index) => item._id}
                  scrollEnabled={false}
                  numColumns={2}
                  columnWrapperStyle={styles.columnWrapper}
                  renderItem={({ item: playlist, index }) => (
                    <Animated.View
                      entering={FadeInDown.delay(300 + index * 50).duration(
                        400
                      )}
                      style={{ width: "48%" }}
                    >
                      <PlaylistCard
                        playlist={playlist}
                        showDeleteOption={pagename === "playlists"}
                        showRemoveAlbumOption={pagename === "albums"}
                      />
                    </Animated.View>
                  )}
                />
              ) : (
                <EmptyContent
                  title="No Playlists Yet"
                  description="Start creating your own playlists to keep your favorite tracks organized."
                  icon={ListMusic}
                  buttonText="Explore Music"
                  onPress={() => router.push("/")}
                />
              )
            ) : songs.length > 0 ? (
              <FlatList
                data={songs}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                scrollEnabled={false}
                renderItem={({ item: song, index }) => (
                  <Animated.View
                    entering={FadeInDown.delay(300 + index * 50).duration(400)}
                  >
                    <AlbumItem
                      song={song}
                      showRemoveFavoriteOption={pagename === "liked"}
                    />
                  </Animated.View>
                )}
              />
            ) : (
              <EmptyContent
                title={
                  pagename === "recently_played"
                    ? "No Recent Activity"
                    : "Your Heart is Empty"
                }
                description={
                  pagename === "recently_played"
                    ? "Start listening to some music and your history will appear here."
                    : "Songs you like will appear here. Find your favorite music and give it a heart!"
                }
                icon={pagename === "recently_played" ? ListMusic : Heart}
                buttonText="Find Music"
                onPress={() => router.push("/")}
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
    lineHeight: 40,
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
