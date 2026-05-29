import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { SongRequest, SongResult } from "@/types";
import { router } from "expo-router";
import { MoreVertical, Radio } from "lucide-react-native";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const SongResultCard = ({
  result,
  isLoading,
}: {
  result: SongResult;
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
      style={styles.container}
      onPress={() => router.push(`../../song/${result.id}`)}
    >
      <Image
        source={resolveImageSource(
          result.image[result.image.length - 1].link,
          "track"
        )}
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
          {result.singers}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        {isBroadcasting && (
          <TouchableOpacity
            onPress={handleSendSongRequest}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.secondaryBackground },
            ]}
          >
            <Radio size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.moreBtn}>
          <MoreVertical size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  moreBtn: {
    padding: 4,
  },
});

export default SongResultCard;
