import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { ListMusic, MoreVertical, Music2, Shuffle } from "lucide-react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, { Track, useActiveTrack } from "react-native-track-player";

import MenuModal, { MenuItem } from "@/components/MenuModal";
import MusicVisualizer from "@/components/songs/MusicVisualizer";
import { colors, fontSize } from "@/constants/tokens";

// ─── Queue Row ────────────────────────────────────────────────────────────────

type QueueRowProps = {
  item: Track;
  index: number;
  isActive: boolean;
  onPlay: (index: number) => void;
  onMenu: (song: Track) => void;
};

const QueueRow = React.memo(
  ({ item, index, isActive, onPlay, onMenu }: QueueRowProps) => (
    <TouchableOpacity
      onPress={() => onPlay(index)}
      activeOpacity={0.75}
      style={[styles.row, isActive && styles.activeRow]}
    >
      {/* Track number / visualizer */}
      <View style={styles.indexCell}>
        {isActive ? (
          <MusicVisualizer playing={true} size={18} color={colors.primary} />
        ) : (
          <Text style={styles.indexText}>{index + 1}</Text>
        )}
      </View>

      {/* Artwork */}
      <View style={styles.artworkWrapper}>
        <Image source={{ uri: item.artwork }} style={styles.artwork} />
        {isActive && <View style={styles.artworkOverlay} />}
      </View>

      {/* Meta */}
      <View style={styles.meta}>
        <Text
          numberOfLines={1}
          style={[styles.trackTitle, isActive && styles.trackTitleActive]}
        >
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.trackArtist}>
          {item.artist}
        </Text>
      </View>

      {/* Menu button */}
      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => onMenu(item)}
        style={styles.moreBtn}
      >
        <MoreVertical size={18} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>
    </TouchableOpacity>
  ),
  (prev, next) =>
    prev.isActive === next.isActive && prev.item.mediaId === next.item.mediaId
);

// ─── Handle pill ──────────────────────────────────────────────────────────────

const QueueHandle = () => (
  <View style={styles.handleOuter}>
    <View style={styles.handlePill} />
  </View>
);

// ─── Custom gradient background ────────────────────────────────────────────────

const QueueBackground = () => (
  <LinearGradient
    colors={[
      "rgba(18, 24, 38, 1)",
      "rgba(12, 18, 30, 1)",
      "rgba(6, 10, 18, 1)",
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
);

// ─── QueueSheet ───────────────────────────────────────────────────────────────
// Accepts a ref so the parent (PlayerScreen) can call .expand() / .close()

const QueueSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const { bottom } = useSafeAreaInsets();

  const snapPoints = useMemo(() => ["75%", "100%"], []);

  const [queue, setQueue] = useState<Track[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const activeTrack = useActiveTrack();

  // Refresh queue whenever the sheet mounts
  useEffect(() => {
    TrackPlayer.getQueue().then(setQueue);
  }, []);

  // Backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.7}
      />
    ),
    []
  );

  // Row renderer
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Track>) => (
      <QueueRow
        item={item}
        index={index}
        isActive={activeTrack?.id === item.id}
        onPlay={(i) => TrackPlayer.skip(i)}
        onMenu={(song) => {
          setMenuItems([
            {
              key: "go_to_album",
              label: "Go to album",
              icon: "album",
              data: song.album,
            },
            {
              key: "go_to_artist",
              label: "Go to artist",
              icon: "artist",
              data: song.artist,
            },
            {
              key: "save_to_playlist",
              label: "Save to playlist",
              icon: "playlist",
              data: song.mediaId,
            },
          ]);
          setMenuVisible(true);
        }}
      />
    ),
    [activeTrack]
  );

  const keyExtractor = useCallback(
    (item: Track, index: number) => `${item.mediaId ?? item.id}-${index}`,
    []
  );

  // Sticky list header
  const ListHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <View style={styles.sectionRow}>
          <View style={styles.sectionIconBg}>
            <ListMusic size={16} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Next Up</Text>
            <Text style={styles.sectionSubtitle}>
              {queue.length} {queue.length === 1 ? "track" : "tracks"}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    ),
    [queue.length]
  );

  // Empty state
  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBg}>
          <Music2 size={32} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Queue is empty</Text>
        <Text style={styles.emptySubtitle}>Add some tracks to get started</Text>
      </View>
    ),
    []
  );

  return (
    <>
      <BottomSheetModal
        ref={ref}
        index={1} // Default index when presented
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundComponent={QueueBackground}
        handleComponent={QueueHandle}
        handleIndicatorStyle={{ display: "none" }}
        style={styles.sheet}
      >
        {/* Sticky sheet header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Queue</Text>
          <TouchableOpacity
            style={styles.shuffleBtn}
            activeOpacity={0.7}
            onPress={() => TrackPlayer.setRepeatMode(1 as any)}
          >
            <Shuffle size={18} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
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
            { paddingBottom: bottom + 24 },
          ]}
        />
      </BottomSheetModal>

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        title="Song Options"
      />
    </>
  );
});

QueueSheet.displayName = "QueueSheet";

export default QueueSheet;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sheet: {
    // Ensure it sits above the player content
    zIndex: 200,
  },

  // Handle
  handleOuter: {
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  handlePill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Sheet header (sticky above list)
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  shuffleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },

  // List header (inside scrollable)
  listHeader: {
    paddingHorizontal: 20,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  sectionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    marginTop: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 8,
  },

  listContent: {
    paddingHorizontal: 0,
  },

  // Queue rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 14,
    gap: 12,
  },
  activeRow: {
    backgroundColor: "rgba(34,197,94,0.08)",
  },
  indexCell: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    fontWeight: "600",
  },
  artworkWrapper: {
    position: "relative",
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  artworkOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    backgroundColor: "rgba(34,197,94,0.15)",
  },
  meta: {
    flex: 1,
    gap: 3,
  },
  trackTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  trackTitleActive: {
    color: colors.primary,
  },
  trackArtist: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontWeight: "500",
  },
  moreBtn: {
    padding: 4,
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    gap: 12,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(34,197,94,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    textAlign: "center",
  },
});
