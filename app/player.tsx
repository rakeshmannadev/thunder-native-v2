import GradientBackground from "@/components/GradientBackground";
import { PlayerControls } from "@/components/songs/PlayerControls";
import { PlayerProgressBar } from "@/components/songs/PlayerProgressbar";
import QueueScreen from "@/components/songs/QueueScreen";
import { MovingText } from "@/components/songs/useMovingText";

import { colors, fontSize, screenPadding } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";

import { defaultStyles } from "@/styles";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronDownIcon, MoreVerticalIcon, Share2 } from "lucide-react-native";
import { useEffect } from "react";

import {
  ActivityIndicator,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const PlayerScreen = () => {
  const router = useRouter();

  const { addToFavorite, favoriteSongs, currentUser } = useUserStore();
  const { currentSong } = usePlayerStore();

  const { top } = useSafeAreaInsets();

  const handleAddToFavorite = async () => {
    if (!currentSong) return;
    await addToFavorite(
      [""],
      currentSong.imageUrl ?? "",
      currentSong.imageUrl,
      currentSong.albumId ?? "",
      currentSong.artists.primary[0].name ?? "",
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
        message: `Check out this song: ${
          currentSong.title
        } by ${currentSong.artists.primary
          .map((artist) => artist.name)
          .join(", ")}`,
        url: currentSong.imageUrl ?? "",
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error("Error sharing the song:", error);
    }
  };

  // Artwork animation
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // animate on mount
    scale.value = withDelay(100, withTiming(1, { duration: 800 }));
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedArtworkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!currentSong) {
    return (
      <View style={[defaultStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator color={colors.icon} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        style={[
          StyleSheet.absoluteFillObject,
          { flex: 1, overflow: "visible" },
        ]}
        colors={["#0F2027", "#203A43", "#2C5364"]}
      >
        <GradientBackground imageUrl={currentSong?.imageUrl} />
        <View style={[styles.overlayContainer]}>
          {/* Close button */}
          <View style={styles.topBarIconContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
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
                onPress={() =>
                  router.push({
                    pathname: "/menu",
                    params: {
                      items: JSON.stringify([
                        {
                          key: "go_to_album",
                          label: "Go to album",
                          onPress: () => console.log("Go to album"),
                          icon: "album",
                          data: currentSong.albumId,
                        },
                        {
                          key: "go_to_artist",
                          label: "Go to artist",
                          onPress: () => null,
                          icon: "artist",
                          data: currentSong.artists.primary[0].artistId,
                        },
                        {
                          key: "save_to_playlist",
                          label: "Save to playlist",
                          onPress: () => null,
                          icon: "playlist",
                          data: currentSong._id,
                        },
                      ]),
                    },
                  })
                }
              >
                <MoreVerticalIcon size={22} color={"#fff"} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, marginTop: top + 70 }}>
            <View style={styles.artworkImageContainer}>
              <Animated.Image
                source={{
                  uri: currentSong.imageUrl,
                }}
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

                    {/* Favorite button icon */}
                    {currentUser && (
                      <FontAwesome
                        name={
                          favoriteSongs.find(
                            (song) => song._id === currentSong._id
                          )
                            ? "heart"
                            : "heart-o"
                        }
                        size={20}
                        color={
                          favoriteSongs.find(
                            (song) => song._id === currentSong._id
                          )
                            ? colors.primary
                            : colors.icon
                        }
                        style={{ marginHorizontal: 14 }}
                        onPress={handleAddToFavorite}
                      />
                    )}
                    {/* Share button icon*/}
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

                  {/* Track artist */}
                  {currentSong.artists && (
                    <Text
                      numberOfLines={1}
                      style={[styles.trackArtistText, { marginTop: 6 }]}
                    >
                      {currentSong.artists.primary
                        .map((artist) => artist.name)
                        .join(",")}
                    </Text>
                  )}
                </View>

                <PlayerProgressBar style={{ marginTop: 32 }} />

                <PlayerControls style={{ marginTop: 40 }} />
              </View>

              {/* <PlayerVolumeBar style={{ marginTop: "auto", marginBottom: 30 }} />

            <View style={utilsStyles.centeredRow}>
              <PlayerRepeatToggle size={30} style={{ marginBottom: 6 }} />
            </View> */}
            </View>
          </View>
        </View>
        <QueueScreen imageUrl={currentSong.imageUrl} />
      </LinearGradient>
    </SafeAreaView>
  );
};

const DismissPlayerSymbol = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        top: top + 8,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View
        accessible={false}
        style={{
          width: 50,
          height: 8,
          borderRadius: 8,
          backgroundColor: "#fff",
          opacity: 0.7,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  topBarIconContainer: {
    flexDirection: "row",
    height: 10,
    width: " 100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingInline: 8,
    paddingTop: 42,
  },
  artworkImageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 20,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "center",
    height: "45%",
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
    fontSize: fontSize.base,
    opacity: 0.8,
    maxWidth: "90%",
  },
  iconContainer: {
    padding: 6,
    borderRadius: 6,
  },
});

export default PlayerScreen;
