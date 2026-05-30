import { Colors } from "@/constants/Colors";
import useShare from "@/hooks/useShare";
import { Song } from "@/types";
import { Share2 } from "lucide-react-native";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ViewStyle,
} from "react-native";

const ShareButton = React.memo(
  ({
    style,
    currentSong,
  }: {
    style?: StyleProp<ViewStyle>;
    currentSong: Song;
  }) => {
    const colorSchema = useColorScheme();
    const colors = Colors[colorSchema === "light" ? "light" : "dark"];

    const { handleShare } = useShare();
    return (
      <TouchableOpacity
        onPress={() => handleShare(currentSong)}
        style={[styles.circularActionBtn, style]}
      >
        <Share2 size={22} color={colors.text} />
      </TouchableOpacity>
    );
  }
);

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
