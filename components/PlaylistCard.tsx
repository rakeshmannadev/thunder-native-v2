import { Colors } from "@/constants/Colors";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
import { Playlist } from "@/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { EllipsisVerticalIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MenuModal, { MenuItem } from "./MenuModal";
import NoDataPlaceholder from "./NoDataPlaceholder";

type SectionGridProps = {
  playlist: Playlist;
  /** Pass true only for user-owned playlists so the Delete option appears */
  showDeleteOption?: boolean;
  /** Pass true for saved albums so the Remove from Library option appears */
  showRemoveAlbumOption?: boolean;
};

const PlaylistCard = ({
  playlist,
  showDeleteOption = false,
  showRemoveAlbumOption = false,
}: SectionGridProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

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

  const subtitle =
    playlist.subtitle || (songsCount > 0 ? `${songsCount} tracks` : "Playlist");

  const menuItems: MenuItem[] = [
    ...(showDeleteOption
      ? [
          {
            key: "edit",
            label: "Edit",
            icon: "edit",
            data: playlist._id || playlist.id,
            destructive: false,
          },

          {
            key: "share",
            label: "Share",
            icon: "share",
            data: playlist._id || playlist.id,
            destructive: false,
          },
          {
            key: "delete-playlist",
            label: "Delete Playlist",
            icon: "delete",
            data: playlist._id || playlist.id,
            destructive: true,
          },
        ]
      : []),
    ...(showRemoveAlbumOption
      ? [
          {
            key: "play-playlist",
            label: "Play",
            icon: "play",
            data: playlist.id,
            destructive: false,
          },
          {
            key: "shuffle",
            label: "Shuffle",
            icon: "shuffle",
            data: playlist.id,
            destructive: false,
          },
          {
            key: "share",
            label: "Share",
            icon: "share",
            data: playlist._id || playlist.id,
            destructive: false,
          },
          {
            key: "remove-saved-album",
            label: "Remove from Library",
            icon: "delete",
            data: playlist._id || playlist.id,
            destructive: true,
          },
        ]
      : []),
  ];

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

        {/* More options button — only when menu items exist */}
        {menuItems.length > 0 && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              setMenuVisible(true);
            }}
            style={styles.moreButton}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <EllipsisVerticalIcon size={16} color="white" />
          </Pressable>
        )}
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

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        title={name}
        imageUrl={imageRaw}
        description={subtitle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    padding: 10,
    width: 180,
    marginBottom: 16,
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
  moreButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
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
