import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { resolveImage } from "@/helpers/resolverImageUrl";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { SongRequest, TopResult } from "@/types";
import { router } from "expo-router";
import { ChevronRight, Radio } from "lucide-react-native";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";

const TopResultCard = ({
  result,
  isLoading,
}: {
  result: TopResult;
  isLoading: boolean;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { isJoined, isBroadcasting, sendSongRequest } = useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();

  const handleSendSongRequest = (e: any) => {
    e.stopPropagation();
    if (!currentUser || !currentRoom) return;

    const song: SongRequest = {
      _id: result.id,
      userName: currentUser?.name,
      userId: currentUser?._id,
      title: result.name,
      albumId: "",
      imageUrl: result.image[result.image.length - 1].link,
    };
    if (isJoined && isBroadcasting && currentRoom && currentUser) {
      sendSongRequest(currentUser._id, currentRoom._id, song);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, { backgroundColor: colors.secondaryBackground }]}
      onPress={() => router.push(`../../${result.type}/${result.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: resolveImage(result.image[result.image.length - 1].link),
          }}
          style={styles.image}
        />
        <View style={[styles.typeBadge, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.typeText}>
            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {result.name}
        </ThemedText>
        <ThemedText style={[styles.description, { color: colors.textMuted }]} numberOfLines={1}>
          {result.description || `Top ${result.type} match`}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        {isBroadcasting && (
          <TouchableOpacity 
            onPress={handleSendSongRequest}
            style={[styles.actionBtn, { backgroundColor: colors.background }]}
          >
            <Radio size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
        <ChevronRight size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  typeBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
  },
  typeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "white",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default TopResultCard;
