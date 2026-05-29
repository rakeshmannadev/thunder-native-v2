import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
import { ArtistResult } from "@/types";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const ArtistResultCard = ({
  result,
  isLoading,
}: {
  result: ArtistResult;
  isLoading: boolean;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => router.push(`../../artist/${result.id}`)}
    >
      <Image
        source={resolveImageSource(result.image, "artist")}
        style={styles.image}
      />
      <View style={styles.content}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {result.name}
        </ThemedText>
        <ThemedText
          style={[styles.description, { color: colors.textMuted }]}
          numberOfLines={1}
        >
          {result.subtitle} • Artist
        </ThemedText>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular for artists
  },
  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default ArtistResultCard;
