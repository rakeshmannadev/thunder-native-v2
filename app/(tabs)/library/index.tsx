import EmptyLibrary from "@/components/EmptyLibrary";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Disc,
  Download,
  Heart,
  ListMusic,
  Plus,
  Settings2,
} from "lucide-react-native";
import { useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - screenPadding.horizontal * 2 - 16) / 2;

const LibraryScreen = () => {
  const router = useRouter();
  const colorSchema = useColorScheme();
  const { top, bottom } = useSafeAreaInsets();
  const colors = Colors[colorSchema === "dark" ? "dark" : "light"];

  const {
    currentUser,
    fetchPlaylists,
    getFavoriteSongs,
    favoriteSongs,
    playlists,
  } = useUserStore();

  useEffect(() => {
    if (currentUser) {
      fetchPlaylists();
      getFavoriteSongs();
    }
  }, [currentUser]);

  if (!currentUser) return <EmptyLibrary />;

  const sections = [
    {
      id: "liked",
      title: "Liked Songs",
      count: favoriteSongs?.length || 0,
      icon: Heart,
      gradient: ["#FF416C", "#FF4B2B"],
      path: "/library_content",
      params: { pagename: "liked" },
      featured: true,
    },
    {
      id: "playlists",
      title: "My Playlists",
      count: playlists?.length || 0,
      icon: ListMusic,
      color: colors.accent,
      path: "/library_content",
      params: { pagename: "playlists" },
    },
    {
      id: "albums",
      title: "Saved Albums",
      count: 0,
      icon: Disc,
      color: "#8E2DE2",
      path: "/library_content",
      params: { pagename: "albums" },
    },
    {
      id: "downloads",
      title: "Downloads",
      count: 0,
      icon: Download,
      color: "#00B4DB",
      path: "/library_content",
      params: { pagename: "downloads" },
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 100 }}
      >
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={[styles.header, { marginTop: top + 20 }]}
        >
          <View>
            <ThemedText style={styles.headerTitle}>Your Library</ThemedText>
            <ThemedText
              style={[styles.headerSubtitle, { color: colors.textMuted }]}
            >
              {favoriteSongs?.length + (playlists?.length || 0)} items in your
              collection
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: colors.secondaryBackground },
            ]}
          >
            <Settings2 size={22} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.content}>
          {/* Featured Liked Songs Card */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: sections[0].path as any,
                  params: sections[0].params,
                })
              }
            >
              <LinearGradient
                colors={sections[0].gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredCard}
              >
                <View style={styles.featuredIconContainer}>
                  <Heart size={32} color="white" fill="white" />
                </View>
                <View style={styles.featuredInfo}>
                  <ThemedText style={styles.featuredTitle}>
                    {sections[0].title}
                  </ThemedText>
                  <ThemedText style={styles.featuredCount}>
                    {sections[0].count} songs
                  </ThemedText>
                </View>
                <ChevronRight size={24} color="rgba(255,255,255,0.7)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Grid Sections */}
          <View style={styles.grid}>
            {sections.slice(1).map((section, index) => (
              <Animated.View
                key={section.id}
                entering={FadeInDown.delay(300 + index * 100).duration(600)}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.gridItem,
                    { backgroundColor: colors.secondaryBackground },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: section.path as any,
                      params: section.params,
                    })
                  }
                >
                  <View
                    style={[
                      styles.gridIconContainer,
                      { backgroundColor: section.color + "20" },
                    ]}
                  >
                    <section.icon size={24} color={section.color} />
                  </View>
                  <ThemedText numberOfLines={1} style={styles.gridTitle}>
                    {section.title}
                  </ThemedText>
                  <ThemedText
                    style={[styles.gridCount, { color: colors.textMuted }]}
                  >
                    {section.count}{" "}
                    {section.id === "playlists" ? "Playlists" : "Items"}
                  </ThemedText>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        entering={FadeInDown.delay(800).springify()}
        style={[styles.fabContainer, { bottom: bottom + 20 }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.fab, { backgroundColor: colors.accent }]}
        >
          <Plus size={24} color="white" strokeWidth={2.5} />
          <ThemedText style={styles.fabText}>Create Playlist</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: screenPadding.horizontal,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: screenPadding.horizontal,
  },
  featuredCard: {
    height: 120,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
    shadowColor: "#FF416C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  featuredIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredInfo: {
    flex: 1,
    marginLeft: 16,
  },
  featuredTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  featuredCount: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  gridItem: {
    width: COLUMN_WIDTH,
    padding: 16,
    borderRadius: 24,
    alignItems: "flex-start",
  },
  gridIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  gridCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  fabContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: screenPadding.horizontal,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});

export default LibraryScreen;
