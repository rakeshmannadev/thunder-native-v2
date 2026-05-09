import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { useRouter } from "expo-router";
import { ArrowRight, Library, Music2 } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

const { width } = Dimensions.get("window");

const EmptyLibrary = () => {
  const router = useRouter();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "dark" ? "dark" : "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Animated Illustration */}
        <Animated.View
          entering={ZoomIn.duration(1000)}
          style={styles.illustrationContainer}
        >
          <View
            style={[styles.glow, { backgroundColor: colors.primary + "20" }]}
          />
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.secondaryBackground },
            ]}
          >
            <Library size={48} color={colors.primary} />
          </View>
          <Animated.View
            entering={FadeInDown.delay(400).duration(800)}
            style={[styles.floatingIcon, { backgroundColor: colors.primary }]}
          >
            <Music2 size={16} color="white" />
          </Animated.View>
        </Animated.View>

        {/* Text Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.textContainer}
        >
          <ThemedText style={[styles.title, { color: colors.text }]}>
            Your Library Awaits
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
            Sign in to sync your favorite tracks, albums, and playlists across
            all your devices.
          </ThemedText>
        </Animated.View>

        {/* Action Button */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(800)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/auth/Login")}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.loginBtnText}>Sign In Now</ThemedText>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exploreLink}
            onPress={() => router.push("/")}
          >
            <ThemedText style={[styles.exploreText, { color: colors.primary }]}>
              Or explore popular music
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: screenPadding.horizontal,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  illustrationContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  glow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    transform: [{ scale: 1.5 }],
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  floatingIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "transparent", // Will be hidden by background
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
  loginBtn: {
    width: "100%",
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  exploreLink: {
    alignItems: "center",
  },
  exploreText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default EmptyLibrary;
