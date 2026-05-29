import { Colors } from "@/constants/Colors";
import { TopAlbums } from "@/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import { Skeleton, SkeletonText } from "../ui/skeleton";

type TopAlbumsCardProps = {
  album: TopAlbums;
  isLoading?: boolean;
};

const TopAlbumsCard = React.memo(
  ({ album, isLoading = false }: TopAlbumsCardProps) => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];

    const handlePress = () => {
      if (album?.id) {
        router.push({
          pathname: "/album/[id]",
          params: { id: album.id },
        });
      }
    };

    const imageUrl =
      album?.image?.[2]?.link ||
      album?.image?.[1]?.link ||
      album?.image?.[0]?.link;

    const artists =
      album?.artist_map?.artists?.map((a) => a.name).join(", ") ||
      "Unknown Artist";

    if (isLoading) {
      return (
        <View style={styles.card}>
          <Skeleton className="w-full h-36 rounded-2xl mb-3" />
          <SkeletonText className="w-24 h-4 mb-2" />
          <SkeletonText className="w-16 h-3" />
        </View>
      );
    }

    return (
      <Animated.View entering={FadeInDown.duration(600)}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={styles.card}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              alt={album?.name || "Album"}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
              style={styles.gradient}
            />
          </View>

          <View style={styles.infoContainer}>
            <ThemedText style={styles.albumName} numberOfLines={1}>
              {album?.name}
            </ThemedText>
            <ThemedText
              style={[styles.artistName, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {artists}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    width: 144,
    marginRight: 16,
    marginBottom: 10,
  },
  imageWrapper: {
    width: 144,
    height: 144,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  albumName: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  artistName: {
    fontSize: 13,
    fontWeight: "600",
  },
});

export default TopAlbumsCard;
