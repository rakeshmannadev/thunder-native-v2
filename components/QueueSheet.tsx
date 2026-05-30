import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import {
  ListMusic,
  MoreVertical,
  Music2,
  Shuffle,
  Trash2,
} from "lucide-react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DeviceEventEmitter,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, {
  Event,
  Track,
  useActiveTrack,
  useTrackPlayerEvents,
} from "react-native-track-player";

import MenuModal, { MenuItem } from "@/components/MenuModal";
import MusicVisualizer from "@/components/songs/MusicVisualizer";
import { Colors } from "@/constants/Colors";
import { getUserPlaylists } from "@/services/userServices";
import { Artist, Playlist } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";

// ─── Queue Row ────────────────────────────────────────────────────────────────

type QueueRowProps = {
  item: Track;
  index: number;
  isActive: boolean;
  onPlay: (index: number) => void;
  onMenu: (song: Track) => void;
};

const QueueRow = React.memo(
  ({ item, index, isActive, onPlay, onMenu }: QueueRowProps) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];

    return (
      <TouchableOpacity
        onPress={() => onPlay(index)}
        activeOpacity={0.75}
        style={[
          styles.row,
          isActive && { backgroundColor: colors.accent + "10" },
        ]}
      >
        <View style={styles.indexCell}>
          {isActive ? (
            <MusicVisualizer playing={true} size={16} color={colors.accent} />
          ) : (
            <ThemedText style={[styles.indexText, { color: colors.textMuted }]}>
              {index + 1}
            </ThemedText>
          )}
        </View>

        <View style={styles.artworkWrapper}>
          <Image
            source={{ uri: item.artwork }}
            style={styles.artwork}
            contentFit="cover"
          />
          {isActive && (
            <View
              style={[
                styles.artworkOverlay,
                { backgroundColor: colors.accent + "20" },
              ]}
            />
          )}
        </View>

        <View style={styles.meta}>
          <ThemedText
            numberOfLines={1}
            style={[styles.trackTitle, isActive && { color: colors.accent }]}
          >
            {item.title}
          </ThemedText>
          <ThemedText
            numberOfLines={1}
            style={[styles.trackArtist, { color: colors.textMuted }]}
          >
            {item.artist}
          </ThemedText>
        </View>

        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => onMenu(item)}
          style={styles.moreBtn}
        >
          <MoreVertical size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
);

// ─── Queue Components ─────────────────────────────────────────────────────────

const QueueHandle = React.memo(
  ({
    animatedIndex,
    colors,
  }: {
    animatedIndex: SharedValue<number>;
    colors: any;
  }) => {
    const animatedIndicatorStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        animatedIndex.value,
        [0, 0.1],
        [0, 1],
        Extrapolation.CLAMP
      ),
    }));

    return (
      <View style={styles.handleContainer}>
        <Animated.View
          style={[
            styles.handleIndicator,
            { backgroundColor: colors.textMuted + "40" },
            animatedIndicatorStyle,
          ]}
        />
        <View style={styles.handleContent}>
          <ListMusic color={colors.text} size={20} />
          <ThemedText style={[styles.handleText, { color: colors.text }]}>
            Up Next
          </ThemedText>
        </View>
      </View>
    );
  }
);

const QueueBackground = React.memo(
  ({
    animatedIndex,
    colors,
  }: {
    animatedIndex: SharedValue<number>;
    colors: any;
  }) => {
    const animatedBgStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        animatedIndex.value,
        [0, 0.1],
        [0, 1],
        Extrapolation.CLAMP
      ),
    }));

    return (
      <Animated.View
        style={[
          styles.backgroundContainer,
          { backgroundColor: colors.background },
          animatedBgStyle,
        ]}
      >
        <LinearGradient
          colors={[colors.background, colors.secondaryBackground]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    );
  }
);

// ─── QueueSheet ───────────────────────────────────────────────────────────────

interface QueueSheetProps {
  animatedIndex: SharedValue<number>;
}

const QueueSheetComponent = forwardRef<BottomSheet, QueueSheetProps>(
  ({ animatedIndex }, ref) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];
    const { bottom } = useSafeAreaInsets();

    const snapPoints = useMemo(() => [60 + bottom, "100%"], [bottom]);

    const animatedContentStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        animatedIndex.value,
        [0.1, 0.2],
        [0, 1],
        Extrapolation.CLAMP
      ),
    }));

    const [queue, setQueue] = useState<Track[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const activeTrack = useActiveTrack();

    const refreshQueue = useCallback(() => {
      TrackPlayer.getQueue().then(setQueue);
    }, []);

    useEffect(() => {
      refreshQueue();

      const sub = DeviceEventEmitter.addListener("queue_updated", refreshQueue);
      return () => sub.remove();
    }, [refreshQueue]);

    useTrackPlayerEvents(
      [Event.PlaybackActiveTrackChanged, Event.PlaybackQueueEnded],
      refreshQueue
    );

    const handlePlay = useCallback((index: number) => {
      TrackPlayer.skip(index);
    }, []);

    const CustomHandle = useCallback(() => {
      return <QueueHandle animatedIndex={animatedIndex} colors={colors} />;
    }, [colors, animatedIndex]);
    // query

    // query

    const { data: playlists } = useQuery({
      queryKey: ["user-playlists"],
      queryFn: getUserPlaylists,
      enabled: true,
    });

    const renderItem = useCallback(
      ({ item, index }: ListRenderItemInfo<Track>) => (
        <QueueRow
          item={item}
          index={index}
          isActive={activeTrack?.id === item.id}
          onPlay={handlePlay}
          onMenu={(song) => {
            setMenuItems([
              {
                key: "go_to_album",
                label: "Go to album",
                icon: "album",
                data: song.album,
              },
              {
                key: "artists",
                label: "Go to artist",
                icon: "artist",

                submenu:
                  song &&
                  song.artist_map?.primary_artists?.map((artist: Artist) => {
                    return {
                      key: "go_to_artist",
                      label: artist.name,
                      icon: "artist",
                      data: artist.id,
                      imageUrl: artist.image,
                    };
                  }),
              },
              {
                key: "playlists",
                label: "Add to Playlist",
                icon: "playlist",
                data: song,
                submenu:
                  playlists &&
                  playlists.map((playlist: Playlist) => ({
                    key: "add_to_playlist",
                    label: playlist.playlistName,
                    imageUrl: playlist.imageUrl,

                    icon: "playlist",
                    data: { song, playlist },
                  })),
              },
              {
                key: "remove_from_queue",
                label: "Remove from queue",
                icon: "delete",
                data: index,
                destructive: true,
              },
            ]);
            setMenuVisible(true);
          }}
        />
      ),
      [activeTrack]
    );

    const keyExtractor = useCallback(
      (item: Track, index: number) => `${item.id}-${index}`,
      []
    );

    const ListHeader = useMemo(
      () => (
        <View style={styles.listHeader}>
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIconBg,
                { backgroundColor: colors.accent + "15" },
              ]}
            >
              <ListMusic size={18} color={colors.accent} />
            </View>
            <View>
              <ThemedText style={styles.sectionTitle}>Next Up</ThemedText>
              <ThemedText
                style={[styles.sectionSubtitle, { color: colors.textMuted }]}
              >
                {queue.length} {queue.length === 1 ? "track" : "tracks"}
              </ThemedText>
            </View>
          </View>
          <View
            style={[styles.divider, { backgroundColor: colors.borderColor }]}
          />
        </View>
      ),
      [queue.length, colors]
    );

    const ListEmpty = useMemo(
      () => (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconBg,
              { backgroundColor: colors.secondaryBackground },
            ]}
          >
            <Music2 size={32} color={colors.accent} />
          </View>
          <ThemedText style={styles.emptyTitle}>Queue is empty</ThemedText>
          <ThemedText
            style={[styles.emptySubtitle, { color: colors.textMuted }]}
          >
            Add some tracks to get started
          </ThemedText>
        </View>
      ),
      [colors]
    );

    const QueueBackgroundComponent = useCallback(() => {
      return <QueueBackground animatedIndex={animatedIndex} colors={colors} />;
    }, [colors, animatedIndex]);

    return (
      <>
        <BottomSheet
          ref={ref}
          index={0}
          snapPoints={snapPoints}
          animatedIndex={animatedIndex}
          handleComponent={CustomHandle}
          backgroundComponent={QueueBackgroundComponent}
          style={styles.sheet}
        >
          <Animated.View style={[{ flex: 1 }, animatedContentStyle]}>
            <View style={styles.header}>
              <ThemedText style={styles.headerTitle}>Playing Queue</ThemedText>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={[
                    styles.headerBtn,
                    { backgroundColor: colors.secondaryBackground },
                  ]}
                  onPress={() => TrackPlayer.setRepeatMode(1)}
                >
                  <Shuffle size={18} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.headerBtn,
                    { backgroundColor: colors.secondaryBackground },
                  ]}
                  onPress={() => {
                    TrackPlayer.reset();
                    setQueue([]);
                  }}
                >
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>

            <BottomSheetFlatList
              data={queue}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListHeaderComponent={ListHeader}
              ListEmptyComponent={ListEmpty}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: bottom + 40 },
              ]}
            />
          </Animated.View>
        </BottomSheet>

        <MenuModal
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          items={menuItems}
          title="Queue Options"
        />
      </>
    );
  }
);

const QueueSheet = React.memo(QueueSheetComponent);

QueueSheet.displayName = "QueueSheet";

const styles = StyleSheet.create({
  sheet: {
    zIndex: 1000,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  handleContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },
  handleIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  handleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  handleText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listHeader: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  sectionIconBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 1,
  },
  divider: {
    height: 1,
    marginBottom: 16,
    opacity: 0.5,
  },
  listContent: {
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 14,
  },
  indexCell: {
    width: 20,
    alignItems: "center",
  },
  indexText: {
    fontSize: 13,
    fontWeight: "700",
  },
  artworkWrapper: {
    position: "relative",
  },
  artwork: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  artworkOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  trackArtist: {
    fontSize: 13,
    fontWeight: "600",
  },
  moreBtn: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 100,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default QueueSheet;
