import { Image } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";

const GradientBackground = React.memo(({ imageUrl }: { imageUrl?: string }) => {
  if (!imageUrl) return null;
  return (
    <Image
      source={{ uri: imageUrl }}
      blurRadius={50}
      style={[StyleSheet.absoluteFill, { opacity: 0.25 }]}
      contentFit="cover"
      // Use memory cache for immediate display on revisit
      cachePolicy="memory-disk"
      // Low priority since this is a decorative background
      priority="low"
    />
  );
});

export default GradientBackground;
