import AlbumItem from "@/components/album/AlbumItem";
import GradientBackground from "@/components/GradientBackground";
import { ThemedText } from "@/components/ThemedText";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";
import { Song } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EllipsisVertical, PlayCircleIcon, Shuffle } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const index = () => {
  const { bottom, top } = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const router = useRouter();
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
    <SafeAreaView style={styles.safeArea}>
      {/* <ActivityIndicator animating={isLoading} size={"large"} /> */}
      {/* --- Background Section --- */}
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={StyleSheet.absoluteFillObject}
      />
      {!isLoading && <GradientBackground imageUrl={songs[0]?.imageUrl} />}

      {/* --- Album Header Section --- */}
      <View style={[styles.headerSection, { marginTop: top + 36 }]}>
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
            <ThemedText style={styles.title}>
              {pagename === "liked" ? "Liked Songs" : "Downloaded"}
            </ThemedText>
          )}

          {isLoading ? (
            <SkeletonText className="w-16 h-4" />
          ) : (
            <ThemedText style={styles.artist} numberOfLines={2}>
              {songs
                .slice(0, 5)
                ?.map((song) =>
                  song.artists.primary.map((artist) => artist.name)
                )
                .join(",") ?? ""}
            </ThemedText>
          )}

          <ThemedText style={styles.songCount}>
            {songs.length ?? 0} Songs
          </ThemedText>

          <View style={styles.controls}>
            <Pressable onPress={handlePlay} style={styles.iconButton}>
              <PlayCircleIcon size={22} color={colors.icon} />
            </Pressable>

            <Pressable onPress={handleShufflePlay} style={styles.iconButton}>
              <Shuffle size={22} color={colors.icon} />
            </Pressable>

            <Pressable
              style={styles.iconButton}
              onPress={() =>
                router.push({
                  pathname: "/menu",
                  params: {
                    items: JSON.stringify([
                      {
                        key: "add_to_queue",
                        label: "Add to Queue",
                        icon: "queue",
                        data: songs,
                      },

                      {
                        key: "remove_from_playlist",
                        label: "Remove from Playlist",
                        icon: "delete",
                        destructive: true,
                      },
                    ]),
                  },
                })
              }
            >
              <EllipsisVertical size={22} color={colors.icon} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottom + 20 },
        ]}
      >
        {/* --- Tracklist Section --- */}
        <FlatList
          data={songs ?? []}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item: song }) => (
            <AlbumItem isLoading={isLoading} song={song} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
    padding: screenPadding.horizontal,
  },
  artworkContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
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
