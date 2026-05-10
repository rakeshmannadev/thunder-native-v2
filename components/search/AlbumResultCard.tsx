import { Colors } from "@/constants/Colors";
import { resolveImage } from "@/helpers/resolverImageUrl";
import { AlbumResult } from "@/types";
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
import { ThemedText } from "@/components/ThemedText";

const AlbumResultCard = ({
  result,
  isLoading,
}: {
  result: AlbumResult;
  isLoading: boolean;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => router.push(`../../album/${result.id}`)}
    >
      <Image
        source={{
          uri: resolveImage(result.image[result.image.length - 1].link),
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {result.name}
        </ThemedText>
        <ThemedText style={[styles.description, { color: colors.textMuted }]} numberOfLines={1}>
          {result.subtitle || "Album"}
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
    width: 56,
    height: 56,
    borderRadius: 10,
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

export default AlbumResultCard;
