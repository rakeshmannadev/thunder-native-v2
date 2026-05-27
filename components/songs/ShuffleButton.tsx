import { Colors } from "@/constants/Colors";
import { showToast } from "@/hooks/useToastMessage";
import { playAlbum } from "@/hooks/useTrackPlayerActions";
import usePlayerStore from "@/store/usePlayerStore";
import { Song } from "@/types";
import { Shuffle } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";

const ShuffleButton = ({ songs }: { songs: Song[] }) => {
  const { setShuffle } = usePlayerStore();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    setShuffle(true);
    showToast("Shuffling songs...");
    playAlbum(songs, Math.floor(Math.random() * songs.length));
  };
  return (
    <Pressable
      onPress={handleShufflePlay}
      style={[
        styles.shuffleButton,
        { backgroundColor: colors.secondaryBackground },
      ]}
    >
      <Shuffle color={colors.text} size={22} />
    </Pressable>
  );
};

export default ShuffleButton;

const styles = StyleSheet.create({
  shuffleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
