// components/player/QueueScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import usePlayerStore from "@/store/usePlayerStore";
import { Song } from "@/types";
import { ListMusic, MoreVertical } from "lucide-react-native";
import GradientBackground from "../GradientBackground";
import { Button, ButtonIcon } from "../ui/button";
import MusicVisualizer from "./MusicVisualizer";

const QUEUE_HEIGHT = 520; // total sheet height
const PEEK_HEIGHT = 80; // visible when peeked

export default function QueueScreen({ imageUrl }: { imageUrl: string }) {
  const { queue, currentSong, setCurrentSong } = usePlayerStore();
  const router = useRouter();

  // sheet translate (start peeked)
  const translateY = useSharedValue(QUEUE_HEIGHT - PEEK_HEIGHT);
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
          Math.min(startY.value + e.translationY, QUEUE_HEIGHT - PEEK_HEIGHT)
        );
        translateY.value = next;
      })
      .onEnd(() => {
        const THRESHOLD = (QUEUE_HEIGHT - PEEK_HEIGHT) / 3;
        if (translateY.value < THRESHOLD) {
          translateY.value = withSpring(0, { stiffness: 160, damping: 20 });
        } else {
          translateY.value = withSpring(QUEUE_HEIGHT - PEEK_HEIGHT, {
            stiffness: 160,
            damping: 20,
          });
        }
      })
      .simultaneousWithExternalGesture(nativeScrollGesture);
  }, [scrollOffset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // FlatList item renderer
  const renderItem = ({ item }: ListRenderItemInfo<Song>) => {
    const isCurrent = currentSong?._id === item._id;

    return (
      <View style={[styles.row, isCurrent && styles.activeRow]}>
        <TouchableOpacity
          onPress={() => {
            setCurrentSong(item);
            translateY.value = withSpring(0);
          }}
          style={{ flex: 1, paddingHorizontal: 8, borderRadius: 8 }}
          activeOpacity={0.85}
        >
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Image
              source={{ uri: item.imageUrl }}
              className="w-10 aspect-square rounded-md"
            />
            <View style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={styles.subtitle}>
                {item.artists?.primary?.map((a: any) => a.name).join(", ")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Visualizer for currently playing */}
        <View style={{ marginLeft: 12, marginRight: 8 }}>
          {isCurrent ? <MusicVisualizer playing={true} /> : null}
        </View>

        {/* Gluestack Menu Trigger wrapped inside Gesture.Native to avoid gesture conflicts */}
        <GestureDetector gesture={Gesture.Native()}>
          <Button
            variant="link"
            size="lg"
            onPress={() =>
              router.push({
                pathname: "/menu",
                params: {
                  items: JSON.stringify([
                    {
                      key: "go_to_album",
                      label: "Go to album",
                      icon: "album",
                      data: item.albumId,
                    },
                    {
                      key: "go_to_artist",
                      label: "Go to artist",
                      icon: "artist",
                      data: item.artists.primary[0]._id,
                    },
                    {
                      key: "save_to_playlist",
                      label: "Save to playlist",
                      icon: "playlist",
                      data: item._id,
                    },
                    {
                      key: "download",
                      label: "Download",
                      icon: "download",
                      data: item.audioUrl,
                    },
                  ]),
                },
              })
            }
          >
            <ButtonIcon as={MoreVertical} />
          </Button>
        </GestureDetector>
      </View>
    );
  };

  // handle scroll offset
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  };

  return (
    // GestureHandlerRootView can be at app root; wrapping here is safe

    <GestureDetector gesture={panGesture}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.sheet,
          animatedStyle,
          // allow menu to overflow the rounded corners
          { overflow: "visible", zIndex: 50 },
        ]}
      >
        {/* gradient background */}
        <LinearGradient
          // colors={getGradientColors(imageColors)}
          colors={["#2C5364", "#203A43", "#0F2027"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <GradientBackground imageUrl={imageUrl} />
          {/* handle + title */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
            <View className="w-full flex flex-row gap-2 items-center justify-center">
              <ListMusic size={16} color={"#fff"} />
              <Text style={styles.sheetTitle}>Queue</Text>
            </View>
          </View>

          {/* list */}
          <View style={styles.listContainer}>
            <GestureDetector gesture={nativeScrollGesture}>
              <FlatList
                ref={listRef}
                data={queue}
                keyExtractor={(_, idx) => String(idx)}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 80 }}
              />
            </GestureDetector>
          </View>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: QUEUE_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  handleContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  handle: {
    width: 56,
    height: 6,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginBottom: 8,
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  listContainer: {
    flex: 1,
    marginTop: 8,
  },
  row: {
    paddingVertical: 12,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
  },
  activeRow: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 4,
  },
});
