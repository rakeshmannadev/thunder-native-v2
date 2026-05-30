import RecentSearches from "@/components/search/RecentSearches";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useSearchStore from "@/store/useSearchStore";
import { Disc, Mic, Music, Search } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const DefaultScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { recentSearches } = useSearchStore();
  console.log("recentsearch: ", recentSearches);
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        {
          justifyContent: recentSearches.length === 0 ? "center" : "flex-start",
        },
      ]}
    >
      <View style={styles.recentSearchesContainer}>
        <RecentSearches />
      </View>

      {recentSearches.length === 0 && (
        <View style={styles.content}>
          {/* Animated Illustration Section */}
          <Animated.View
            entering={ZoomIn.duration(800)}
            style={styles.illustrationContainer}
          >
            {/* Background Glow */}
            <View
              style={[styles.glow, { backgroundColor: colors.primary + "15" }]}
            />

            {/* Layered Floating Icons */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000)}
              style={[
                styles.floatingIcon,
                styles.musicIcon,
                { backgroundColor: colors.secondaryBackground },
              ]}
            >
              <Music size={24} color={colors.primary} />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(600).duration(1000)}
              style={[
                styles.floatingIcon,
                styles.discIcon,
                { backgroundColor: colors.secondaryBackground },
              ]}
            >
              <Disc size={24} color={colors.primary} />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(800).duration(1000)}
              style={[
                styles.floatingIcon,
                styles.micIcon,
                { backgroundColor: colors.secondaryBackground },
              ]}
            >
              <Mic size={24} color={colors.primary} />
            </Animated.View>

            {/* Main Search Icon */}
            <View
              style={[
                styles.mainIconCircle,
                { backgroundColor: colors.secondaryBackground },
              ]}
            >
              <Search size={56} color={colors.primary} />
            </View>
          </Animated.View>

          {/* Text Content Section */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(800)}
            style={styles.textContainer}
          >
            <ThemedText style={styles.title}>Search the Universe</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
              Explore millions of tracks, albums, and artists. Your next
              favorite song is just a search away.
            </ThemedText>
          </Animated.View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screenPadding.horizontal,
    paddingBottom: 40,
  },
  recentSearchesContainer: {
    marginTop: 40,
  },
  content: {
    width: width * 0.85,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
  },
  glow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    transform: [{ scale: 1.8 }],
  },
  mainIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 2,
    zIndex: 2,
  },
  floatingIcon: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 3,
  },
  musicIcon: {
    top: 0,
    right: 0,
  },
  discIcon: {
    bottom: 20,
    left: -10,
  },
  micIcon: {
    top: 20,
    left: 10,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  decorationLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginTop: 40,
  },
});

export default DefaultScreen;
