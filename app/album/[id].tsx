import { useLocalSearchParams, useRouter } from "expo-router";
import {
  HeartIcon,
  MoreVerticalIcon,
  PlayIcon,
  Shuffle,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
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

import { ThemedText } from "@/components/ThemedText";
import AlbumItem from "@/components/album/AlbumItem";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";

const AlbumScreen = () => {
  const { id }: { id: string } = useLocalSearchParams();
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { addAlbumToPlaylist, playlists } = useUserStore();
  const { isLoading, fetchAlbumById, currentAlbum } = useMusicStore();
  const { playAlbum, setShuffle } = usePlayerStore();

  useEffect(() => {
    if (id) {
      useMusicStore.setState({ currentAlbum: null });
      fetchAlbumById(id);
    }
  }, [id, fetchAlbumById]);

  const isAddedToPlaylist = playlists.find(
    (p) => p.albumId === currentAlbum?.albumId
  );

  const handlePlay = () => {
    if (!currentAlbum) return;
    setShuffle(false);
    playAlbum(currentAlbum.songs, 0);
  };
  const handleShufflePlay = () => {
    if (!currentAlbum) return;
    setShuffle(true);
    playAlbum(
      currentAlbum.songs,
      Math.floor(Math.random() * currentAlbum.songs.length)
    );
  };
  const handleAddAlbumToFavorite = () => {
    if (!currentAlbum) return;
    const songs = currentAlbum.songs.map((s) => s._id);
    addAlbumToPlaylist(
      null,
      currentAlbum.title,
      currentAlbum.artists.primary,
      currentAlbum.albumId,
      currentAlbum.imageUrl,
      songs
    );
  };

  if (isLoading) {
    return (
      <View
        style={{ backgroundColor: colors.background }}
        className="flex flex-1 justify-center items-center"
      >
        <ActivityIndicator
          size={"large"}
          color={colors.primary}
          animating={isLoading}
        />
      </View>
    );
  }
  if (!currentAlbum) return null;
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={StyleSheet.absoluteFillObject}
      />
      {!isLoading && <GradientBackground imageUrl={currentAlbum?.imageUrl} />} */}
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.topBarIconContainer}>
          <View
            style={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable
              onPressIn={() =>
                router.push({
                  pathname: "/menu",
                  params: {
                    items: JSON.stringify([
                      {
                        key: "share",
                        label: "Share",

                        icon: "share",
                      },
                      {
                        key: "go_to_artist",
                        label: "Go to artist",

                        icon: "artist",
                        data: currentAlbum.artists.primary[0].id,
                      },
                      {
                        key: "save_to_playlist",
                        label: "Save to playlist",

                        icon: "playlist",
                        data: currentAlbum.albumId,
                      },
                    ]),
                  },
                })
              }
            >
              <MoreVerticalIcon size={22} color={colors.icon} />
            </Pressable>
          </View>
        </View>

        {/* --- Album Header Section --- */}
        <View style={[styles.headerSection, { marginTop: top }]}>
          <View style={styles.artworkContainer}>
            {isLoading ? (
              <Skeleton variant="sharp" />
            ) : (
              <Image
                source={{
                  uri: currentAlbum?.imageUrl,
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
                {currentAlbum?.title ?? "Unknown Album"}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
              >
                {currentAlbum?.artists.primary.map((a) => a.name).join(", ") ??
                  ""}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-10 h-4" />
            ) : (
              <ThemedText
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
              >
                {currentAlbum?.songs.length ?? 0} Songs
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-32 h-8" />
            ) : (
              <View style={styles.controls}>
                <Pressable
                  onPress={handleAddAlbumToFavorite}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.component },
                  ]}
                >
                  <HeartIcon
                    size={20}
                    fill={isAddedToPlaylist ? "green" : "none"}
                    color={isAddedToPlaylist ? "green" : colors.icon}
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
                  onPress={handleShufflePlay}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.component },
                  ]}
                >
                  <Shuffle size={22} color={colors.icon} />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: screenPadding.horizontal,
            paddingBlock: 20,
            paddingBottom: bottom + 50,
          }}
        >
          {/* --- Tracklist Section --- */}
          <FlatList
            data={currentAlbum?.songs ?? []}
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

export default AlbumScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    marginTop: 30,
  },
  topBarIconContainer: {
    flexDirection: "row",
    height: 10,
    width: " 100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingInline: 8,
    marginTop: 18,
  },
  headerSection: {
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
    paddingHorizontal: screenPadding.horizontal,
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
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  artist: {
    ...defaultStyles.text,
    fontSize: fontSize.xs,
    opacity: 0.8,
    marginVertical: 6,
  },
  songCount: {
    ...defaultStyles.text,
    fontSize: fontSize.sm,
    opacity: 0.7,
  },
  controls: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 25,
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
  },
});
