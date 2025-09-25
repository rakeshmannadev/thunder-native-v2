import { PlayerControls } from "@/components/songs/PlayerControls";
import { PlayerProgressBar } from "@/components/songs/PlayerProgressbar";
import { PlayerRepeatToggle } from "@/components/songs/PlayerRepeatToggle";
import { PlayerVolumeBar } from "@/components/songs/PlayerVolumeBar";
import { MovingText } from "@/components/songs/useMovingText";

import { colors, fontSize, screenPadding } from "@/constants/tokens";
import { getGradientColors } from "@/helpers/getGradientColors";
import { usePlayerBackground } from "@/hooks/usePlayerBackground";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";

import { defaultStyles, utilsStyles } from "@/styles";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronDownIcon } from "lucide-react-native";

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const PlayerScreen = () => {
  const { addToFavorite, favoriteSongs } = useUserStore();
  const { currentSong } = usePlayerStore();

  const { player } = usePlayer();
  const unknownTrackImageUri = require("../assets/images/unknown_track.png");

  const { imageColors } = usePlayerBackground(
    currentSong?.imageUrl ?? unknownTrackImageUri
  );

  const { top, bottom } = useSafeAreaInsets();

  // const { isFavorite, toggleFavorite } = useTrackPlayerFavorite()
  const handleAddToFavorite = () => {
    if (!currentSong) return;
    addToFavorite(
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

  let isFavorite: boolean = false;

  favoriteSongs.map((song) => {
    if (song?.songId == currentSong?.songId) {
      isFavorite = true;
    }
  });

  console.log(isFavorite);
  if (!currentSong) {
    return (
      <View style={[defaultStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator color={colors.icon} />
      </View>
    );
  }

  return (
    <LinearGradient style={{ flex: 1 }} colors={getGradientColors(imageColors)}>
      <View style={styles.overlayContainer}>
        {/* <DismissPlayerSymbol /> */}
        {/* Close button */}
        <View style={styles.closeIconContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <ChevronDownIcon size={30} color={"#fff"} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginTop: top + 70, marginBottom: bottom }}>
          <View style={styles.artworkImageContainer}>
            <Image
              source={{
                uri: currentSong.imageUrl ?? unknownTrackImageUri,
              }}
              resizeMode="cover"
              style={styles.artworkImage}
            />
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ marginTop: "auto" }}>
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
                  <FontAwesome
                    name={isFavorite ? "heart" : "heart-o"}
                    size={20}
                    color={isFavorite ? colors.primary : colors.icon}
                    style={{ marginHorizontal: 14 }}
                    onPress={handleAddToFavorite}
                  />
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

            <PlayerVolumeBar style={{ marginTop: "auto", marginBottom: 30 }} />

            <View style={utilsStyles.centeredRow}>
              <PlayerRepeatToggle size={30} style={{ marginBottom: 6 }} />
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeIconContainer: {
    height: 40,
    width: 40,
    justifyContent: "space-between",
    alignItems: "center",
    paddingInline: 8,
    paddingTop: 30,
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
});

export default PlayerScreen;
