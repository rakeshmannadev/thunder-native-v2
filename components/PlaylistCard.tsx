import { Colors } from "@/constants/Colors";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
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
import NoDataPlaceholder from "./NoDataPlaceholder";

type SectionGridProps = {
  playlist: any;
};

const PlaylistCard = ({ playlist }: SectionGridProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();

  if (!playlist) {
    return (
      <NoDataPlaceholder
        compact={true}
        pagename="Missing Playlist"
        description="This playlist content is currently unavailable."
      />
    );
  }

  const id = playlist.id || playlist._id;
  const name = playlist.name || playlist?.playlistName;
  const imageRaw = playlist?.image || playlist?.imageUrl;
  const songsCount = playlist?.songs?.length ?? 0;

  // Format subtitle beautifully: use explicit subtitle, or tracks count if available

  const subtitle =
    playlist.subtitle || (songsCount > 0 ? `${songsCount} tracks` : "Playlist");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        router.push({
          pathname: "/playlist/[id]",
          params: { id },
        });
      }}
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.secondaryBackground,
          shadowColor: colorScheme === "dark" ? "#000" : "#94a3b8",
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={resolveImageSource(imageRaw, "track")}
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
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text
          style={[styles.subtitle, { color: colors.textMuted }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

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

export default PlaylistCard;
