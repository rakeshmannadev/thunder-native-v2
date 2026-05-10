import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";

const PlayButton = ({
  color,
  handlePlay,
  title,
}: {
  color: string;
  handlePlay: () => void;
  title: string;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePlay}
      style={[styles.playButton, { backgroundColor: color }]}
    >
      <MaterialCommunityIcons name="play" size={24} color="white" />
      <ThemedText style={styles.playButtonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
};

export default PlayButton;

const styles = StyleSheet.create({
  playButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  playButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
