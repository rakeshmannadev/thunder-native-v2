import AlbumItem from "@/components/album/AlbumItem";
import AlbumCard from "@/components/AlbumCard";
import GradientBackground from "@/components/GradientBackground";
import SongCardSkeleton from "@/components/skeleton/SongCardSkeleton";
import { ThemedText } from "@/components/ThemedText";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import { defaultStyles } from "@/styles";
import { Album, Song } from "@/types";
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

const ArtistPage = () => {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();
  const { id }: { id: string } = useLocalSearchParams();

  const { currentArtist, fetchArtistById, isLoading, fetchAlbumById } =
    useMusicStore();
  const { setShuffle, playAlbum } = usePlayerStore();

  useEffect(() => {
    if (id) {
      useMusicStore.setState({ currentArtist: null });
      fetchArtistById(id);
    }
  }, [id, fetchArtistById]);

  const handlePlay = () => {
    if (!currentArtist) return;
    const songs: Song[] = [...currentArtist.topSongs];
    setShuffle(false);
    playAlbum(songs, 0);
  };
  const handleShufflePlay = () => {
    if (!currentArtist) return;
    const songs: Song[] = [...currentArtist.topSongs];
    setShuffle(true);
    playAlbum(songs, Math.floor(Math.random() * songs.length));
  };

  // if (isLoading) {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor:
  //           Colors[colorScheme === "dark" ? "dark" : "light"].background,
  //       }}
  //       className="flex-1 justify-center items-center"
  //     >
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  // if (!currentArtist) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={StyleSheet.absoluteFillObject}
      />
      {!isLoading && <GradientBackground imageUrl={currentArtist?.image} />}

      {/* --- Album Header Section --- */}
      <View style={[styles.headerSection, { marginTop: top + 36 }]}>
        <View style={styles.artworkContainer}>
          {isLoading ? (
            <Skeleton variant="sharp" />
          ) : (
            <Image
              source={{
                uri: currentArtist?.image,
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
              {currentArtist?.name ?? "Unknown Artist"}
            </ThemedText>
          )}

          {isLoading ? (
            <SkeletonText className="w-16 h-4" />
          ) : (
            currentArtist && (
              <ThemedText style={styles.artist}>
                {currentArtist?.type.charAt(0).toUpperCase() +
                  currentArtist?.type.slice(1)}
              </ThemedText>
            )
          )}

          {isLoading ? (
            <SkeletonText className="w-10 h-4" />
          ) : (
            currentArtist && (
              <ThemedText style={styles.songCount}>
                {currentArtist.singles.length + currentArtist.topSongs.length ||
                  0}{" "}
                Songs
              </ThemedText>
            )
          )}

          {isLoading ? (
            <SkeletonText className="w-32 h-8" />
          ) : (
            <View style={styles.controls}>
              {/* TODO: Make backend endpoint for adding artist to favorite */}
              {/* <Pressable
                    onPress={handleAddAlbumToFavorite}
                    style={styles.iconButton}
                  >
                    <HeartIcon
                      size={20}
                      fill={isAddedToPlaylist ? "green" : "none"}
                      color={isAddedToPlaylist ? "green" : colors.icon}
                    />
                  </Pressable> */}

              <Pressable onPress={handlePlay} style={styles.iconButton}>
                <PlayCircleIcon size={22} color={colors.icon} />
              </Pressable>

              <Pressable onPress={handleShufflePlay} style={styles.iconButton}>
                <Shuffle size={22} color={colors.icon} />
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/menu",
                    params: {
                      items: JSON.stringify([
                        {
                          key: "add_to_queue",
                          label: "Add to Queue",
                          icon: "queue",
                          data: [...currentArtist!.topSongs],
                        },

                        {
                          key: "share",
                          label: "Share",
                          icon: "share",
                        },
                      ]),
                    },
                  })
                }
                style={styles.iconButton}
              >
                <EllipsisVertical size={22} color={colors.icon} />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottom + 40 },
        ]}
      >
        {/* --- Albums Section --- */}

        <ThemedText
          type="subtitle"
          style={{ paddingHorizontal: screenPadding.horizontal }}
        >
          Albums
        </ThemedText>
        <FlatList
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={(item: Album) =>
            isLoading ? `skeleton-${Math.random()}` : item._id.toString()
          }
          data={isLoading ? Array.from({ length: 5 }) : currentArtist?.albums}
          renderItem={({ item: Album }) =>
            isLoading ? (
              <SongCardSkeleton />
            ) : (
              <AlbumCard album={Album} isLoading={isLoading} />
            )
          }
        />

        {/* --- Singles Section --- */}

        <ThemedText
          type="subtitle"
          style={{ paddingHorizontal: screenPadding.horizontal }}
        >
          Singles
        </ThemedText>
        <FlatList
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={(item: Album) =>
            isLoading ? `skeleton-${Math.random()}` : item._id.toString()
          }
          data={isLoading ? Array.from({ length: 5 }) : currentArtist?.singles}
          renderItem={({ item: Album }) =>
            isLoading ? (
              <SongCardSkeleton />
            ) : (
              <AlbumCard album={Album} isLoading={isLoading} />
            )
          }
        />

        {/* --- Top songs Section --- */}

        <ThemedText
          type="subtitle"
          style={{ paddingHorizontal: screenPadding.horizontal }}
        >
          Top Songs
        </ThemedText>
        <FlatList
          data={currentArtist?.topSongs}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          horizontal={false}
          renderItem={({ item: song }) => (
            <AlbumItem isLoading={isLoading} song={song} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArtistPage;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: 20,
  },
  listContainer: {
    flexDirection: "column",
    gap: 20,
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
