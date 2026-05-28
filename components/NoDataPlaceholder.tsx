import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { useRouter } from "expo-router";
import { AlertCircle, Compass, Info, Music } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface NoDataPlaceholderProps {
  pagename?: string;
  description?: string;
  onPress?: () => void;
  buttonText?: string;
  compact?: boolean;
}

const NoDataPlaceholder = ({
  pagename,
  description,
  onPress,
  buttonText,
  compact = false,
}: NoDataPlaceholderProps) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const router = useRouter();

  // Get icon depending on pagename
  const getIcon = () => {
    const pageLower = pagename?.toLowerCase() || "";
    if (pageLower.includes("playlist")) {
      return <Music size={compact ? 20 : 40} color={colors.primary} />;
    }
    if (pageLower.includes("search") || pageLower.includes("explore")) {
      return <Compass size={compact ? 20 : 40} color={colors.primary} />;
    }
    if (pageLower.includes("error") || pageLower.includes("fail") || pageLower.includes("empty")) {
      return <AlertCircle size={compact ? 20 : 40} color={colors.primary} />;
    }
    return <Info size={compact ? 20 : 40} color={colors.primary} />;
  };

  const displayTitle = pagename 
    ? pagename.charAt(0).toUpperCase() + pagename.slice(1)
    : "No Data Available";

  const displayDescription = description || "We couldn't find any content here. Try exploring some music!";

  if (compact) {
    return (
      <View
        style={[
          styles.compactContainer,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}15` }]}>
          {getIcon()}
        </View>
        <View style={styles.compactTextContainer}>
          <Text style={[styles.compactTitle, { color: colors.text }]} numberOfLines={1}>
            {displayTitle}
          </Text>
          <Text style={[styles.compactDescription, { color: colors.textMuted }]} numberOfLines={2}>
            {displayDescription}
          </Text>
        </View>
      </View>
    );
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Glowing background accents to make the screen pop and look premium */}
      {colorSchema === "dark" && (
        <View style={styles.glowContainer}>
          <View style={[styles.glowBall, { backgroundColor: colors.primary, top: -100, left: -50 }]} />
          <View style={[styles.glowBall, { backgroundColor: colors.secondary, bottom: -100, right: -50 }]} />
        </View>
      )}

      <View style={styles.content}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: colors.secondaryBackground,
              borderColor: `${colors.primary}20`,
            },
          ]}
        >
          <View style={[styles.innerIconCircle, { backgroundColor: `${colors.primary}15` }]}>
            {getIcon()}
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{displayTitle}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {displayDescription}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={styles.buttonText}>{buttonText || (onPress ? "Action" : "Go Back")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    zIndex: 2,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 1,
  },
  glowBall: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.08,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  innerIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: borderRadius.lg || 24,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  // Compact layouts
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: borderRadius.md || 12,
    borderWidth: 1,
    width: "100%",
    marginVertical: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  compactTextContainer: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  compactDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default NoDataPlaceholder;
