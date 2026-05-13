import { Colors } from "@/constants/Colors";
import { Share2 } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useActiveTrack } from "react-native-track-player";

const ShareButton = () => {
  const currentSong = useActiveTrack();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const handleShare = useCallback(async () => {
    if (!currentSong) return;
    try {
      await Share.share(
        {
          title: currentSong.title,
          message: `Check out ${currentSong.title} by ${currentSong.artist} on Thunder!`,
          url: currentSong.url ?? "",
        },
        { dialogTitle: currentSong.title, subject: "Check out this song" }
      );
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [currentSong]);
  return (
    <TouchableOpacity onPress={handleShare} style={styles.circularActionBtn}>
      <Share2 size={22} color={colors.text} />
    </TouchableOpacity>
  );
};

export default ShareButton;
const styles = StyleSheet.create({
  circularActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(128,128,128,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
