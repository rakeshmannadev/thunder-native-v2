import { Song } from "@/types";
import { Share } from "react-native";

const useShare = () => {
  const handleShare = async (currentSong: Song) => {
    if (!currentSong) return;
    try {
      // Create a Universal Link (HTTPS) to the backend domain so it becomes clickable
      const deepLink = `https://thunder-backend-ye33.onrender.com/api/v1/songs/s/${currentSong.id}`;

      // Construct a structured message that social apps can parse
      const shareMessage = `Check out "${currentSong.name}" by ${currentSong.subtitle} on Thunder!\n\nListen here: ${deepLink}`;

      await Share.share(
        {
          title: currentSong.name,
          message: shareMessage,
          url: deepLink, // Best for iOS to show the URL separately
        },
        {
          dialogTitle: `Share ${currentSong.name}`,
          subject: "Check out this song on Thunder",
        }
      );
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  return { handleShare };
};

export default useShare;
