import GradientBackground from "@/components/GradientBackground";
import { PlayerControls } from "@/components/songs/PlayerControls";
import { PlayerProgressBar } from "@/components/songs/PlayerProgressbar";
import { MovingText } from "@/components/songs/useMovingText";

import MenuModal, { MenuItem } from "@/components/MenuModal";
import QueueSheet from "@/components/QueueSheet";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";

import { defaultStyles } from "@/styles";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronDownIcon, MoreVerticalIcon, Share2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.25;

const EXPAND_SPRING = { damping: 26, stiffness: 240, mass: 0.8 };
const COLLAPSE_SPRING = { damping: 34, stiffness: 300, mass: 0.9 };

const PlayerScreen = () => {
  const router = useRouter();
  const queueSheetRef = useRef<BottomSheetModal>(null);

  const { addToFavorite, favoriteSongs, currentUser } = useUserStore();
  const currentSong = useActiveTrack();

  const { top } = useSafeAreaInsets();

  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems: MenuItem[] = currentSong
    ? [
        {
          key: "go_to_album",
          label: "Go to album",
          icon: "album",
          data: currentSong.albumId,
        },
        {
          key: "go_to_artist",
          label: "Go to artist",
          icon: "artist",
          data: currentSong.artist,
        },
        {
          key: "save_to_playlist",
          label: "Save to playlist",
          icon: "playlist",
          data: currentSong._id,
        },
      ]
    : [];

  const handleAddToFavorite = async () => {
    if (!currentSong) return;
    await addToFavorite(
      [""],
      currentSong.imageUrl ?? "",
      currentSong.imageUrl,
      currentSong.albumId ?? "",
      currentSong.artist ?? "",
      currentSong.duration ?? 0,
      currentSong.releaseYear ?? "",
      currentSong._id,
      currentSong.songId,
      currentSong.title ?? "",
      "Favorites"
    );
  };

  const handleShare = async () => {
    if (!currentSong) return;
    try {
      const shareOptions = {
        title: currentSong.title,
        message: `Check out this song: ${currentSong.title} by ${currentSong.artist}`,
        url: currentSong.artwork ?? "",
      };
      await Share.share(shareOptions);
    } catch (error) {
      console.error("Error sharing the song:", error);
    }
  };

  // ── Artwork entry animation ───────────────────────────────────────
  const artworkScale = useSharedValue(0.9);
  const artworkOpacity = useSharedValue(0);

  useEffect(() => {
    artworkScale.value = 0.9;
    artworkOpacity.value = 0;
    artworkScale.value = withDelay(100, withTiming(1, { duration: 800 }));
    artworkOpacity.value = withTiming(1, { duration: 800 });
  }, [currentSong?._id]);

  const animatedArtworkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: artworkScale.value }],
    opacity: artworkOpacity.value,
  }));

  // ── Swipe-to-dismiss gesture ──────────────────────────────────────
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetY(10) // activate only on intentional downward drag
    .failOffsetY(-5) // fail fast on upward swipe so controls work
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      // only allow dragging downward
      translateY.value = Math.max(0, startY.value + e.translationY);
    })
    .onEnd((e) => {
      if (e.velocityY > 1000 || translateY.value > DISMISS_THRESHOLD) {
        // Fast ease-in to screen bottom then dismiss — no spring bounce delay
        translateY.value = withTiming(
          SCREEN_HEIGHT,
          { duration: 150, easing: Easing.in(Easing.ease) },
          () => {
            runOnJS(router.back)();
          }
        );
      } else {
        // Snap back to fully open
        translateY.value = withSpring(0, EXPAND_SPRING);
      }
    });

  // Container slides with the finger + border-radius morphs on drag
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    // Solid background prevents black flash on the transparent modal
    backgroundColor: "#000",
    borderTopLeftRadius: interpolate(
      translateY.value,
      [0, 80],
      [0, 24],
      Extrapolation.CLAMP
    ),
    borderTopRightRadius: interpolate(
      translateY.value,
      [0, 80],
      [0, 24],
      Extrapolation.CLAMP
    ),
    overflow: "hidden",
  }));

  if (!currentSong) {
    return (
      <View style={[defaultStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator color={colors.icon} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flex: 1 }, animatedContainerStyle]}>
          <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
              style={[
                StyleSheet.absoluteFill,
                { flex: 1, overflow: "visible" },
              ]}
              colors={["#0F2027", "#203A43", "#2C5364"]}
            >
              <GradientBackground imageUrl={currentSong?.artwork} />
              <View style={styles.overlayContainer}>
                {/* Drag handle — visual cue that screen is swipeable */}
                <View style={styles.dragHandleContainer}>
                  <View style={styles.dragHandle} />
                </View>

                {/* Top bar */}
                <View
                  style={[styles.topBarIconContainer, { paddingTop: top + 4 }]}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.back()}
                  >
                    <ChevronDownIcon size={30} color={"#fff"} />
                  </TouchableOpacity>

                  <View
                    style={{
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setMenuVisible(true)}
                    >
                      <MoreVerticalIcon size={22} color={"#fff"} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ flex: 1, marginTop: top + 4 }}>
                  <View style={styles.artworkImageContainer}>
                    <Animated.Image
                      source={{ uri: currentSong.artwork }}
                      resizeMode="cover"
                      style={[styles.artworkImage, animatedArtworkStyle]}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ marginTop: 20 }}>
                      <View style={{ height: 60 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {/* Track title */}
                          <View style={styles.trackTitleContainer}>
                            <MovingText
                              text={currentSong.title ?? ""}
                              animationThreshold={30}
                              style={styles.trackTitleText}
                            />
                          </View>

                          {/* Favorite button */}
                          {currentUser && (
                            <FontAwesome
                              name={
                                favoriteSongs.find(
                                  (s) => s._id === currentSong._id
                                )
                                  ? "heart"
                                  : "heart-o"
                              }
                              size={20}
                              color={
                                favoriteSongs.find(
                                  (s) => s._id === currentSong._id
                                )
                                  ? colors.primary
                                  : colors.icon
                              }
                              style={{ marginHorizontal: 14 }}
                              onPress={handleAddToFavorite}
                            />
                          )}

                          {/* Share button */}
                          <Pressable
                            onPress={handleShare}
                            style={({ pressed }) => [
                              {
                                backgroundColor: pressed
                                  ? "rgb(210, 230, 255)"
                                  : "white",
                              },
                              styles.iconContainer,
                            ]}
                          >
                            <Share2 size={20} color={colors.icon} />
                          </Pressable>
                        </View>

                        <MovingText
                          style={[
                            styles.trackArtistText,
                            { color: colors.textMuted },
                          ]}
                          text={currentSong.artist ?? ""}
                          animationThreshold={25}
                        />
                      </View>

                      <PlayerProgressBar style={{ marginTop: 32 }} />
                      <PlayerControls style={{ marginTop: 10 }} />

                      {/* Queue button */}
                      <View
                        style={{
                          marginTop: 12,
                          paddingHorizontal: 32,
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => queueSheetRef.current?.present()}
                        >
                          <MaterialIcons
                            name="queue-music"
                            size={30}
                            color={colors.icon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <MenuModal
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                items={menuItems}
                title="Song Options"
              />
            </LinearGradient>
          </SafeAreaView>
        </Animated.View>
      </GestureDetector>
      <QueueSheet ref={queueSheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingTop: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  topBarIconContainer: {
    flexDirection: "row",
    height: 10,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingInline: 8,
  },
  artworkImageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 20,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "center",
    height: "55%",
  },
  artworkImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 12,
  },
  trackTitleContainer: {
    flex: 1,
    overflow: "hidden",
  },
  trackTitleText: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  trackArtistText: {
    ...defaultStyles.text,
    fontSize: fontSize.sm,
    opacity: 0.8,
  },

  iconContainer: {
    padding: 6,
    borderRadius: 6,
  },
});

export default PlayerScreen;
