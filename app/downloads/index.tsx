import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Download,
  EllipsisVertical,
  Search,
  Shuffle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EmptyContent from "@/components/EmptyContent";
import MenuModal, { MenuItem } from "@/components/MenuModal";
import PlayButton from "@/components/PlayButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import { formatDuration } from "@/helpers";
import useDownloadSong from "@/hooks/useDownloadSong";
import { usePlayDownloadSongs } from "@/hooks/usePlayDownloadSongs";
import { DownloadedSong } from "@/types";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 280;

const DownloadsScreen = () => {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { downloadedSongsList, deleteDownload } = useDownloadSong();
  const { playSong, playAlbum } = usePlayDownloadSongs();

  const [searchQuery, setSearchQuery] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<DownloadedSong | null>(null);

  const filteredSongs = downloadedSongsList.filter(
    (song) =>
      song.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      song.artist?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handlePlayAll = async () => {
    if (filteredSongs.length === 0) return;
    playAlbum(filteredSongs, 0);
  };

  const handleShufflePlay = () => {
    if (filteredSongs.length === 0) return;
    playAlbum(filteredSongs, Math.floor(Math.random() * filteredSongs.length));
  };

  const handleSongPress = (song: DownloadedSong) => {
    playSong(song);
  };

  const openMenu = (song: DownloadedSong) => {
    setSelectedSong(song);
    setMenuVisible(true);
  };

  const menuItems: MenuItem[] = selectedSong
    ? [
        {
          key: "play_next",
          label: "Play next",
          icon: "play_next",
          data: selectedSong,
        },
        {
          key: "add_to_queue",
          label: "Add to Queue",
          icon: "queue",
          data: [selectedSong],
        },
        {
          key: "share",
          label: "Share",
          icon: "share",
          data: selectedSong,
        },
        {
          key: "delete_download",
          label: "Delete",
          icon: "delete",
          destructive: true,
          data: selectedSong.id,
        },
      ]
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Decorative Gradient Background */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={["#00B4DB", "transparent", "transparent"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>

      {/* Header View */}
      <Animated.View
        entering={FadeInUp.duration(600)}
        style={[styles.header, { paddingTop: top + 10, left: -4 }]}
      >
        <View
          style={[
            styles.backButton,
            { backgroundColor: colors.secondaryBackground },
          ]}
        ></View>
        <ThemedText style={styles.headerTitle}>Downloads</ThemedText>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Search Input */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={styles.searchContainer}
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          <Search color={colors.textMuted} size={18} />
          <TextInput
            placeholder="Search downloads..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </Animated.View>

      {downloadedSongsList.length === 0 ? (
        <EmptyContent
          title="No Offline Tracks"
          description="Download your favorite songs to play them without an internet connection."
          icon={Download}
          buttonText="Browse Music"
          onPress={() => router.push("/")}
        />
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: screenPadding.horizontal,
            paddingBottom: bottom + 100,
          }}
          ListHeaderComponent={
            filteredSongs.length > 0 ? (
              <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                <View style={styles.statsContainer}>
                  <ThemedText
                    style={[styles.subtitle, { color: colors.textMuted }]}
                  >
                    {filteredSongs.length} tracks offline • In-App Storage
                  </ThemedText>
                </View>

                <View style={styles.actionRow}>
                  <PlayButton
                    handlePlay={handlePlayAll}
                    title="Play All"
                    color="#00B4DB"
                  />

                  <Pressable
                    onPress={handleShufflePlay}
                    style={[
                      styles.shuffleButton,
                      { backgroundColor: colors.secondaryBackground },
                    ]}
                  >
                    <Shuffle color={colors.text} size={22} />
                  </Pressable>
                </View>
              </Animated.View>
            ) : null
          }
          renderItem={({ item: song, index }) => (
            <Animated.View
              entering={FadeInDown.delay(300 + index * 50).duration(400)}
            >
              <TouchableOpacity
                onPress={() => handleSongPress(song)}
                style={styles.songItem}
              >
                <Image
                  source={song.artwork}
                  style={styles.songImage}
                  contentFit="cover"
                />

                <View style={styles.songDetails}>
                  <ThemedText numberOfLines={1} style={styles.songName}>
                    {song.title}
                  </ThemedText>

                  <View style={styles.songMetaRow}>
                    <View style={styles.offlineBadge}>
                      <Download size={10} color="#00B4DB" />
                    </View>
                    <ThemedText
                      numberOfLines={1}
                      style={[styles.songArtist, { color: colors.textMuted }]}
                    >
                      {song.artist}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText
                  style={[styles.duration, { color: colors.textMuted }]}
                >
                  {formatDuration(song.duration ?? 0)}
                </ThemedText>

                <TouchableOpacity
                  onPress={() => openMenu(song)}
                  style={styles.moreButton}
                >
                  <EllipsisVertical size={20} color={colors.icon} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          )}
          ListEmptyComponent={
            searchQuery ? (
              <EmptyContent
                title="No results found"
                description={`We couldn't find "${searchQuery}" in your offline tracks.`}
                icon={Search}
                buttonText="Clear search"
                onPress={() => setSearchQuery("")}
              />
            ) : null
          }
        />
      )}

      {selectedSong && (
        <MenuModal
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          items={menuItems}
          imageUrl={selectedSong?.artwork || ""}
          title={selectedSong?.title || ""}
          description={selectedSong?.artist || ""}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    opacity: 0.15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: screenPadding.horizontal,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: screenPadding.horizontal,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 8,
  },
  statsContainer: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  shuffleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150, 150, 150, 0.1)",
  },
  songImage: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(150, 150, 150, 0.1)",
  },
  songDetails: {
    flex: 1,
    marginLeft: 14,
    gap: 4,
  },
  songName: {
    fontSize: 16,
    fontWeight: "700",
  },
  songMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  offlineBadge: {
    padding: 2,
    backgroundColor: "rgba(0, 180, 219, 0.12)",
    borderRadius: 4,
  },
  songArtist: {
    fontSize: 13,
    fontWeight: "500",
  },
  duration: {
    fontSize: 12,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  moreButton: {
    padding: 8,
  },
});

export default DownloadsScreen;
