import { Colors } from "@/constants/Colors";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
import { Album } from "@/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Skeleton, SkeletonText } from "./ui/skeleton";

type SectionGridProps = {
  album: Album;
  isLoading: boolean;
};

const AlbumCard = React.memo(({ album, isLoading }: SectionGridProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const handlePress = () => {
    if (!isLoading && album) {
      router.push({
        pathname: "/album/[id]",
        params: { id: album.id },
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={isLoading || !album}
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.secondaryBackground,
          shadowColor: colorScheme === "dark" ? "#000" : "#94a3b8",
        },
      ]}
    >
      <View style={styles.imageContainer}>
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-xl" style={{ width: "100%", height: "100%" }} />
        ) : (
          <>
            <Image
              source={resolveImageSource(album?.image, "album")}
              style={styles.image}
              contentFit="cover"
              placeholder={undefined}
            />
            {/* Soft elegant gradient overlay on image */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.45)"]}
              style={StyleSheet.absoluteFill}
            />
            {/* Modern play button badge floating in bottom right */}
            <View style={[styles.playBadge, { backgroundColor: colors.primary }]}>
              <Play size={12} color="white" fill="white" style={styles.playIcon} />
            </View>
          </>
        )}
      </View>

      <View style={styles.infoContainer}>
        {isLoading ? (
          <View style={{ gap: 6 }}>
            <SkeletonText className="w-28 h-4" />
            <SkeletonText className="w-20 h-3" />
          </View>
        ) : (
          <>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {album?.name}
            </Text>
            <Text
              style={[styles.subtitle, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {album?.subtitle}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    padding: 10,
    width: 180,
    marginBottom: 16,
    // Premium soft card shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  playBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  playIcon: {
    marginLeft: 2, // Slight offset to visually center the play triangle
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AlbumCard;

