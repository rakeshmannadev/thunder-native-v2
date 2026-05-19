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

const ShareButton = React.memo(() => {
  const currentSong = useActiveTrack();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const handleShare = useCallback(async () => {
    if (!currentSong) return;
    try {
      // Create a Universal Link (HTTPS) to the backend domain so it becomes clickable
      const deepLink = `https://thunder-backend-ye33.onrender.com/api/v1/songs/s/${currentSong.id}`;

      // Construct a structured message that social apps can parse
      const shareMessage = `Check out "${currentSong.title}" by ${currentSong.artist} on Thunder!\n\nListen here: ${deepLink}`;

      await Share.share(
        {
          title: currentSong.title,
          message: shareMessage,
          url: deepLink, // Best for iOS to show the URL separately
        },
        {
          dialogTitle: `Share ${currentSong.title}`,
          subject: "Check out this song on Thunder",
        }
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
});

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
