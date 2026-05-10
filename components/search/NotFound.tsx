import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Search, Info, Ghost } from "lucide-react-native";
import React from "react";
import { StyleSheet, useColorScheme, View, Dimensions } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const NotFound = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Animated Illustration Section */}
        <Animated.View 
          entering={ZoomIn.duration(800)} 
          style={styles.illustrationContainer}
        >
          {/* Background Glow */}
          <View style={[styles.glow, { backgroundColor: colors.primary + '10' }]} />
          
          {/* Main Illustration Element */}
          <View style={[styles.mainIconCircle, { backgroundColor: colors.secondaryBackground }]}>
            <View style={styles.searchIconWrapper}>
                <Search size={56} color={colors.textMuted} strokeWidth={1.5} />
                <View style={[styles.questionMark, { backgroundColor: colors.primary }]}>
                    <ThemedText style={styles.questionText}>?</ThemedText>
                </View>
            </View>
          </View>

          {/* Floating Decorative Elements */}
          <Animated.View 
            entering={FadeInDown.delay(500).duration(1000)}
            style={[styles.floatingBadge, { backgroundColor: colors.secondaryBackground, top: 0, right: 20 }]}
          >
            <Ghost size={20} color={colors.primary} />
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(700).duration(1000)}
            style={[styles.floatingBadge, { backgroundColor: colors.secondaryBackground, bottom: 20, left: 0 }]}
          >
            <Info size={20} color={colors.primary} />
          </Animated.View>
        </Animated.View>

        {/* Text Content Section */}
        <Animated.View 
            entering={FadeInDown.delay(400).duration(800)} 
            style={styles.textContainer}
        >
          <ThemedText style={styles.title}>No Results Found</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
            We couldn't find any matches for your search. Try checking for typos or use different keywords.
          </ThemedText>
        </Animated.View>

        {/* Action Suggestion / Decoration */}
        <Animated.View 
            entering={FadeIn.delay(1000).duration(1000)}
            style={[styles.tipContainer, { backgroundColor: colors.secondaryBackground }]}
        >
            <ThemedText style={[styles.tipText, { color: colors.textMuted }]}>
                Tip: Search by artist name or album title for better results.
            </ThemedText>
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
    paddingTop: 40,
  },
  content: {
    width: width * 0.85,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContainer: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  glow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    transform: [{ scale: 1.8 }],
  },
  mainIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
    zIndex: 2,
  },
  searchIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  questionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
  floatingBadge: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 3,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  tipContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tipText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  }
});

export default NotFound;
