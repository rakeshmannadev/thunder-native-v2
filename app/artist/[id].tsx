import AlbumItem from "@/components/album/AlbumItem";
import AlbumCard from "@/components/AlbumCard";
import SongCardSkeleton from "@/components/skeleton/SongCardSkeleton";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import { defaultStyles } from "@/styles";
import { Album, Song } from "@/types";
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

const ArtistPage = () => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={StyleSheet.absoluteFillObject}
      />
      {!isLoading && <GradientBackground imageUrl={currentArtist?.image} />} */}

      <ScrollView
        showsVerticalScrollIndicator={true}
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
              <ThemedText
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
                className="text-2xl"
              >
                {currentArtist?.name ?? "Unknown Artist"}
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
                {(currentArtist &&
                  currentArtist?.type.charAt(0).toUpperCase() +
                    currentArtist?.type.slice(1)) ||
                  "Artist"}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-10 h-4" />
            ) : (
              <ThemedText style={styles.songCount}>
                {currentArtist?.topSongs.length ?? 0} Songs
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-32 h-8" />
            ) : (
              <View style={styles.controls}>
                <Pressable
                  onPress={() => null}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.component },
                  ]}
                >
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
