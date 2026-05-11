import { Colors } from "@/constants/Colors";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

interface EmptyContentProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText?: string;
  onPress?: () => void;
}

const EmptyContent = ({
  title,
  description,
  icon: Icon,
  buttonText,
  onPress,
}: EmptyContentProps) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "dark" ? "dark" : "light"];

  return (
    <View style={styles.container}>
      <Animated.View
        entering={ZoomIn.duration(800)}
        style={styles.iconContainer}
      >
        <View style={[styles.glow, { backgroundColor: colors.primary + "20" }]} />
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          <Icon size={48} color={colors.primary} />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(600)}
        style={styles.textContainer}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={[styles.description, { color: colors.textMuted }]}>
          {description}
        </ThemedText>
      </Animated.View>

      {buttonText && onPress && (
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  glow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    transform: [{ scale: 1.5 }],
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default EmptyContent;
