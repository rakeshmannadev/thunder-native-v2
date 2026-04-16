// components/player/QueueScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors, fontSize } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import { Song } from "@/types";
import { ListMusic, MoreVertical } from "lucide-react-native";
import MenuModal, { MenuItem } from "../MenuModal";
import MusicVisualizer from "./MusicVisualizer";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const QUEUE_HEIGHT = SCREEN_HEIGHT * 0.75; // 75% of screen for more content
const PEEK_HEIGHT = 100;
const COLLAPSED_Y = QUEUE_HEIGHT - PEEK_HEIGHT;

// ── Spring configs ──────────────────────────────────────────────────
// Expand: slightly elastic snap for a satisfying open
const EXPAND_SPRING = { damping: 26, stiffness: 240, mass: 0.8 };
// Collapse: fast, critically damped — decisive close
const COLLAPSE_SPRING = { damping: 34, stiffness: 300, mass: 0.9 };

// ── Memoized row — only re-renders when isActive changes ────────────
type QueueRowProps = {
  item: Song;
  index: number;
  isActive: boolean;
  onPlay: (index: number) => void;
  onMenu: (song: Song) => void;
};

const QueueRow = React.memo(
  ({ item, index, isActive, onPlay, onMenu }: QueueRowProps) => (
    <View style={[styles.row, isActive && styles.activeRow]}>
      <TouchableOpacity
        onPress={() => onPlay(index)}
        style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 4 }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Image source={{ uri: item.imageUrl }} style={styles.songImage} />
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={[styles.title, isActive && { color: colors.primary }]}
            >
              {item.title}
            </Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {item.artists?.primary?.map((a: any) => a.name).join(", ")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ paddingHorizontal: 8 }}>
        {isActive ? <MusicVisualizer playing={true} /> : null}
      </View>

      <TouchableOpacity style={{ padding: 8 }} onPress={() => onMenu(item)}>
        <MoreVertical size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  ),
  (prev, next) =>
    prev.isActive === next.isActive && prev.item._id === next.item._id
);

export default function QueueScreen({ imageUrl }: { imageUrl: string }) {
  const { queue, currentSong, currentIndex, playQueueIndex } = usePlayerStore();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // sheet translate (start peeked)
  const translateY = useSharedValue(COLLAPSED_Y);
  const startY = useSharedValue(0);

  // track scroll offset to lock sheet drag while user scrolls
  const [scrollOffset, setScrollOffset] = useState(0);
  const listRef = useRef<FlatList<any> | null>(null);

  // native scroll gesture so FlatList can be used inside GestureDetector
  const nativeScrollGesture = Gesture.Native();

  // create pan gesture; recreate when scrollOffset changes so `enabled(...)` updates
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(scrollOffset <= 0)
      .onStart(() => {
        startY.value = translateY.value;
      })
      .onUpdate((e) => {
        const next = Math.max(
          0,
          Math.min(startY.value + e.translationY, COLLAPSED_Y)
        );
        translateY.value = next;
      })
      .onEnd((e) => {
        // Use a lower threshold (35%) so small swipes feel responsive
        const THRESHOLD = COLLAPSED_Y * 0.35;

        // Velocity-aware snapping — fast swipes override position
        if (e.velocityY < -600 || translateY.value < THRESHOLD) {
          // Swiping up or past threshold → expand
          translateY.value = withSpring(0, EXPAND_SPRING);
        } else if (e.velocityY > 600 || translateY.value >= THRESHOLD) {
          // Swiping down or below threshold → collapse
          translateY.value = withSpring(COLLAPSED_Y, COLLAPSE_SPRING);
        }
      })
      .simultaneousWithExternalGesture(nativeScrollGesture);
  }, [scrollOffset]);

  // ── Animated styles ───────────────────────────────────────────────
  const animatedStyle = useAnimatedStyle(() => {
    // Progress: 0 = fully expanded, 1 = fully collapsed/peeked
    const progress = interpolate(
      translateY.value,
      [0, COLLAPSED_Y],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: translateY.value }],
      // Border radius opens up when expanded, rounds when collapsed
      borderTopLeftRadius: interpolate(
        progress,
        [0, 0.3],
        [16, 32],
        Extrapolation.CLAMP
      ),
      borderTopRightRadius: interpolate(
        progress,
        [0, 0.3],
        [16, 32],
        Extrapolation.CLAMP
      ),
    };
  });

  // Backdrop dims the content behind the queue when it slides up
  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, COLLAPSED_Y],
      [0.5, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      // Only intercept touches when backdrop is visible
      display: opacity > 0.01 ? ("flex" as const) : ("none" as const),
    };
  });

  // FlatList item renderer — delegates to memoized QueueRow
  const renderItem = ({ item, index }: ListRenderItemInfo<Song>) => (
    <QueueRow
      item={item}
      index={index}
      isActive={currentIndex === index}
      onPlay={(i) => {
        playQueueIndex(i);
        translateY.value = withSpring(COLLAPSED_Y, COLLAPSE_SPRING);
      }}
      onMenu={(song) => {
        setMenuItems([
          { key: "go_to_album", label: "Go to album", icon: "album", data: song.albumId },
          { key: "go_to_artist", label: "Go to artist", icon: "artist", data: song.artists.primary[0].artistId },
          { key: "save_to_playlist", label: "Save to playlist", icon: "playlist", data: song._id },
        ]);
        setMenuVisible(true);
      }}
    />
  );

  // handle scroll offset
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  };

  return (
    <>
      {/* Backdrop overlay — dims content behind queue */}
      <Animated.View
        pointerEvents="none"
        style={[styles.backdrop, backdropStyle]}
      />

      <GestureDetector gesture={panGesture}>
        <Animated.View
          pointerEvents="auto"
          style={[
            styles.sheet,
            animatedStyle,
            { zIndex: 100 },
          ]}
        >
          {/* gradient background */}
          <LinearGradient
            colors={[
              "rgba(44, 83, 100, 0.98)",
              "rgba(32, 58, 67, 0.98)",
              "rgba(15, 32, 39, 0.98)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          >
            {/* handle + title */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
              <View style={styles.header}>
                <ListMusic size={20} color={colors.primary} />
                <Text style={styles.sheetTitle}>Next Up</Text>
              </View>
            </View>

            {/* list */}
            <View style={styles.listContainer}>
              <GestureDetector gesture={nativeScrollGesture}>
                <FlatList
                  ref={listRef}
                  data={queue}
                  keyExtractor={(item, index) => `${item._id}-${index}`}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  onScroll={onScroll}
                  scrollEventThrottle={16}
                  contentContainerStyle={{ paddingBottom: 40 }}
                />
              </GestureDetector>
            </View>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        title="Song Options"
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 99,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: QUEUE_HEIGHT,
    backgroundColor: "transparent",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  handleContainer: {
    alignItems: "center",
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  sheetTitle: {
    color: "#fff",
    fontSize: fontSize.sm,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  listContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    borderRadius: 12,
  },
  activeRow: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  title: {
    color: "#fff",
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
