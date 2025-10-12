import React from "react";
import { Image, StyleSheet } from "react-native";

const GradientBackground = ({ imageUrl }: { imageUrl?: string }) => {
  if (!imageUrl) return;
  return (
    <Image
      source={{ uri: imageUrl }}
      blurRadius={50}
      style={[StyleSheet.absoluteFillObject, { opacity: 0.25 }]}
      resizeMode="cover"
    />
  );
};

export default GradientBackground;
