import { ThemedText } from "@/components/ThemedText";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import { usePlayerBackground } from "@/hooks/usePlayerBackground";
import { defaultStyles } from "@/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import {
  EllipsisVertical,
  HeartIcon,
  PlayCircleIcon,
  Shuffle,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ImageColorsResult } from "react-native-image-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AlbumItem from "@/components/album/AlbumItem";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { songToTrack } from "@/helpers/SongToTrack";
import { useQueueStore } from "@/store/useQueue";
import useUserStore from "@/store/useUserStore";
import { Song } from "@/types";

const PlaylistScreen = () => {
  const { id }: { id: string } = useLocalSearchParams();

  const unknownTrackImageUri = require("../../assets/images/unknown_track.png");

  const queueOffset = useRef(0);

  const { bottom } = useSafeAreaInsets();
  const {
    playlistLoading: isLoading,
    getPlaylistSongs,
    currentPlaylist,
    addAlbumToPlaylist,
    playlists,
  } = useUserStore();

  const getGradientColors = (imageColors: ImageColorsResult | null) => {
    if (!imageColors) {
      // Default colors if imageColors is not available
      return [
        colors.maximumTrackTintColor,
        colors.minimumTrackTintColor,
        colors.background,
      ] as const;
    }

    if (Platform.OS === "web" && "darkMuted" in imageColors) {
      return [
        imageColors.darkMuted ?? colors.maximumTrackTintColor,
        imageColors.darkVibrant ?? colors.minimumTrackTintColor,
        imageColors.lightMuted ?? colors.background,
      ] as const;
    }

    if (Platform.OS === "android" && "vibrant" in imageColors) {
      return [
        imageColors.vibrant ?? colors.minimumTrackTintColor,
        imageColors.muted ?? colors.maximumTrackTintColor,
      ] as const;
    }

    if (Platform.OS === "ios" && "primary" in imageColors) {
      return [
        imageColors.primary ?? colors.minimumTrackTintColor,
        imageColors.secondary ?? colors.maximumTrackTintColor,
      ] as const;
    }

    return [
      colors.maximumTrackTintColor,
      colors.minimumTrackTintColor,
      colors.background,
    ] as const; // Fallback
  };

  useEffect(() => {
    if (id) {
      useUserStore.setState({ currentPlaylist: null });
      getPlaylistSongs(id);
    }
  }, [id, getPlaylistSongs]);

  const { imageColors } = usePlayerBackground(
    currentPlaylist?.imageUrl ?? unknownTrackImageUri
  );

  const { activeQueueId, setActiveQueueId } = useQueueStore();

  const handleTrackChange = async (selectedTrack: Song) => {
    const trackToAdd = songToTrack(selectedTrack);
    const trackIndex = currentPlaylist!.songs.findIndex(
      (playlistTrack: Song) => playlistTrack.audioUrl == trackToAdd.url
    );

    if (trackIndex === -1) return;

    const isChangingQueue = id !== activeQueueId;

    if (isChangingQueue) {
      const beforeTracks = currentPlaylist!.songs
        .slice(0, trackIndex)
        .map(songToTrack);
      const afterTracks = currentPlaylist!.songs
        .slice(trackIndex + 1)
        .map(songToTrack);

      // await TrackPlayer.reset();

      // construct new queue
      // await TrackPlayer.add(trackToAdd);
      // await TrackPlayer.add(afterTracks);
      // await TrackPlayer.add(beforeTracks);

      // await TrackPlayer.play();

      queueOffset.current = trackIndex;
      setActiveQueueId(id);
    } else {
      const nextTrackIndex =
        trackIndex - queueOffset.current < 0
          ? currentPlaylist!.songs.length + trackIndex - queueOffset.current
          : trackIndex - queueOffset.current;

      // await TrackPlayer.skip(nextTrackIndex);
      // TrackPlayer.play();
    }
  };
  const handlePlay = async () => {
    const tracks = currentPlaylist!.songs.map(songToTrack);
    // await TrackPlayer.reset();
    // await TrackPlayer.add(tracks);
    // await TrackPlayer.play();
  };
  const handleShufflePlay = async () => {
    const shuffledTracks = [...currentPlaylist!.songs.map(songToTrack)].sort(
      () => Math.random() - 0.5
    );
    // await TrackPlayer.reset();
    // await TrackPlayer.add(shuffledTracks);
    // await TrackPlayer.play();
  };

  const handleAddAlbumToPlaylist = () => {
    if (currentPlaylist) {
      const songs: string[] = [];
      currentPlaylist.songs.map((song: { _id: string }) => {
        songs.push(song._id);
      });
      addAlbumToPlaylist(
        currentPlaylist.playlistId,
        currentPlaylist.playlistName,
        currentPlaylist.artist,
        currentPlaylist.albumId,
        currentPlaylist.imageUrl,
        songs
      );
    }
  };

  const isAddedToPlaylist = playlists.find(
    (playlist) => playlist.playlistId === currentPlaylist?.playlistId
  );
  return (
    <LinearGradient style={{ flex: 1 }} colors={getGradientColors(imageColors)}>
      <ScrollView style={styles.overlayContainer} className="my-16">
        <View
          style={{
            flex: 1,

            display: "flex",
            flexDirection: "row",
            gap: 15,
            marginTop: 10,
            marginBottom: bottom,
          }}
        >
          <View style={styles.artworkImageContainer}>
            {isLoading ? (
              <Skeleton variant="sharp" />
            ) : (
              <Image
                source={{
                  uri: currentPlaylist?.imageUrl ?? unknownTrackImageUri,
                }}
                resizeMode="cover"
                style={styles.artworkImage}
              />
            )}
          </View>
          {/* Track details */}
          <View style={styles.trackTitleContainer}>
            {isLoading ? (
              <SkeletonText _lines={1} className="w-20 h-4" />
            ) : (
              <ThemedText style={styles.trackTitleText}>
                {currentPlaylist?.playlistName ?? "Test title"}
              </ThemedText>
            )}
            {/* Track artists */}
            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText
                style={styles.trackArtistText}
                className="w-full max-h-12 truncate  "
              >
                {currentPlaylist?.artist
                  .map((artist) => artist.name)
                  .join(", ") ?? "Test title"}
              </ThemedText>
            )}
            {/* Songs count */}
            {isLoading ? (
              <SkeletonText className="w-12 h-4" />
            ) : (
              <ThemedText type="default">
                {currentPlaylist?.songs.length ?? "50"} {"Songs"}
              </ThemedText>
            )}
            {/* 3dot menu */}
            <View className="flex flex-row gap-1 items-center   w-fit">
              <Pressable
                onPress={handleAddAlbumToPlaylist}
                className="hover:bg-hover-background w-fit rounded-full p-2"
              >
                <HeartIcon
                  size={18}
                  fill={isAddedToPlaylist ? "green" : ""}
                  color={isAddedToPlaylist ? "green" : "white"}
                />
              </Pressable>
              <Pressable
                onPress={handlePlay}
                className="hover:bg-hover-background w-fit rounded-full p-2"
              >
                <PlayCircleIcon size={18} />
              </Pressable>
              <Pressable
                onPress={handleShufflePlay}
                className="hover:bg-hover-background w-fit rounded-full p-2"
              >
                <Shuffle size={18} />
              </Pressable>
              <Pressable className="hover:bg-hover-background w-fit rounded-full p-2 ">
                <EllipsisVertical size={18} />
              </Pressable>
            </View>
          </View>
        </View>
        {/* Song lists */}
        <View className="mt-5">
          {
            <FlatList
              key={currentPlaylist?._id}
              data={currentPlaylist?.songs}
              renderItem={({ item: song }) => (
                <AlbumItem
                  isLoading={isLoading}
                  song={song}
                  handleTrackChange={handleTrackChange}
                />
              )}
            />
          }
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  overlayContainer: {
    ...defaultStyles.container,

    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  artworkImageContainer: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 11.0,
    flexDirection: "row",
    justifyContent: "center",
    height: "90%",
    width: "55%",
  },
  artworkImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 12,
  },
  trackTitleContainer: {
    marginTop: 15,
    flex: 1,
    overflow: "hidden",
    gap: 10,
    lineHeight: 15,
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
export default PlaylistScreen;
