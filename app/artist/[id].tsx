import AlbumItem from "@/components/album/AlbumItem";
import AlbumCard from "@/components/AlbumCard";
import PlaylistCard from "@/components/PlaylistCard";
import SongCardSkeleton from "@/components/skeleton/SongCardSkeleton";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { resolveImage } from "@/helpers/resolverImageUrl";
import { playAlbum } from "@/hooks/useTrackPlayerActions";
import { getArtistById } from "@/services/songService";
import usePlayerStore from "@/store/usePlayerStore";
import { Artist, Song } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Play, Radio, Shuffle } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  FlatList,
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
const HEADER_HEIGHT = 450;

const ArtistPage = () => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();
  const { id }: { id: string } = useLocalSearchParams();
  const scrollY = useSharedValue(0);

  const { setShuffle } = usePlayerStore();

  const { data: currentArtistResponse, isPending: isLoading } = useQuery({
    queryKey: ["artist", id],
    queryFn: () => getArtistById(id as string),
    enabled: !!id,
  });

  const currentArtist: Artist = currentArtistResponse?.data?.artist;

  const handlePlay = () => {
    if (!currentArtist || !currentArtist.top_songs) return;
    playAlbum(currentArtist.top_songs, 0);
  };

  const handleShufflePlay = () => {
    if (!currentArtist || !currentArtist.top_songs) return;
    const songs: Song[] = [...currentArtist.top_songs];
    setShuffle(true);
    playAlbum(songs, Math.floor(Math.random() * songs.length));
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT - 120], [1, 0]),
      transform: [
        {
          scale: interpolate(scrollY.value, [-100, 0], [1.15, 1], "clamp"),
        },
      ],
    };
  });

  const artistImage = currentArtist?.image
    ? resolveImage(currentArtist.image)
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Immersive Parallax Header */}
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        {artistImage ? (
          <Image
            source={{ uri: artistImage }}
            style={styles.headerImage}
            contentFit="cover"
          />
        ) : (
          <View
            style={[
              styles.headerImage,
              { backgroundColor: colors.secondaryBackground },
            ]}
          />
        )}
        <Animated.View style={StyleSheet.absoluteFillObject}>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "rgba(0,0,0,0.2)" },
            ]}
          />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: "transparent",
                borderBottomWidth: 100,
                borderBottomColor: colors.background,
                opacity: 0.8,
              },
            ]}
          />
        </Animated.View>
      </Animated.View>

      {/* Navigation Bar */}
      <View style={[styles.navBar, { top: top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.navButton}>
          <ArrowLeft color="white" size={24} />
        </Pressable>
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT - 120,
          paddingBottom: bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <ThemedText style={styles.title}>
              {currentArtist?.name ??
                (isLoading ? "Loading Artist..." : "Artist")}
            </ThemedText>

            <ThemedText
              style={[styles.subtitle, { color: "rgba(255,255,255,0.8)" }]}
            >
              {isLoading
                ? "Finding details..."
                : `${currentArtist?.fan_count || 0} Monthly Listeners • ${currentArtist?.subtitle || ""}`}
            </ThemedText>

            {/* Action Bar */}
            <View style={styles.actionRow}>
              <Button
                size="xl"
                onPress={handlePlay}
                style={[styles.playButton, { backgroundColor: colors.primary }]}
              >
                <ButtonIcon as={Play} color="white" size="lg" fill="white" />
                <ButtonText style={styles.playButtonText}>Play</ButtonText>
              </Button>

              <Pressable
                onPress={handleShufflePlay}
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.secondaryBackground },
                ]}
              >
                <Shuffle color={colors.text} size={22} />
              </Pressable>

              <Pressable
                onPress={() => null}
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.secondaryBackground },
                ]}
              >
                <Radio color={colors.text} size={22} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Sections */}
          <View style={styles.sectionsContainer}>
            {/* Albums */}
            <Section title="Albums" isLoading={isLoading} colors={colors}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListContent}
                data={
                  isLoading
                    ? Array.from({ length: 5 })
                    : currentArtist?.top_albums
                }
                keyExtractor={(item: any, index) =>
                  isLoading ? `skeleton-album-${index}` : item.id.toString()
                }
                renderItem={({ item }) =>
                  isLoading ? (
                    <SongCardSkeleton />
                  ) : (
                    <AlbumCard album={item} isLoading={false} />
                  )
                }
              />
            </Section>

            {/* Latest Release */}
            {!isLoading && currentArtist?.latest_release?.length > 0 && (
              <Section
                title="Latest Release"
                isLoading={isLoading}
                colors={colors}
              >
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContent}
                  data={currentArtist.latest_release}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <AlbumCard album={item} isLoading={false} />
                  )}
                />
              </Section>
            )}

            {/* Top Songs */}
            <Section
              title="Popular Tracks"
              isLoading={isLoading}
              colors={colors}
            >
              <View style={styles.verticalList}>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <SongCardSkeleton key={i} />
                    ))
                  : currentArtist?.top_songs?.map((song, index) => (
                      <Animated.View
                        key={song.id}
                        entering={FadeInDown.delay(300 + index * 50).duration(
                          400
                        )}
                      >
                        <AlbumItem song={song} isLoading={false} />
                      </Animated.View>
                    ))}
              </View>
            </Section>

            {/* Playlists */}
            {!isLoading &&
              currentArtist?.dedicated_artist_playlist?.length > 0 && (
                <Section
                  title="Dedicated Artist Playlists"
                  isLoading={isLoading}
                  colors={colors}
                >
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListContent}
                    data={currentArtist.dedicated_artist_playlist}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <PlaylistCard playlist={item} isLoading={false} />
                    )}
                  />
                </Section>
              )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const Section = ({ title, isLoading, children, colors }: any) => (
  <View style={styles.section}>
    <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
      {title}
    </ThemedText>
    {children}
  </View>
);

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
  navBar: {
    position: "absolute",
    left: screenPadding.horizontal,
    right: screenPadding.horizontal,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: screenPadding.horizontal,
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "white",
    letterSpacing: -1.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
  playButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  playButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionsContainer: {
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  horizontalListContent: {
    gap: 16,
    paddingRight: screenPadding.horizontal,
  },
  verticalList: {
    gap: 4,
  },
});

export default ArtistPage;
