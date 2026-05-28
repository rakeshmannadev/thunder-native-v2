import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { ThemedText } from "./ThemedText";

const ExpandableText = ({
  text,
  isLoading,
}: {
  text: string;
  isLoading: boolean;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const [isSubtitleExpanded, setIsSubtitleExpanded] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <ThemedText
        onTextLayout={(e) => {
          setShowReadMoreButton(e.nativeEvent.lines.length > 2);
        }}
        style={[
          styles.subtitle,
          { position: "absolute", opacity: 0, left: 0, right: 0 },
        ]}
      >
        {text}
      </ThemedText>

      <ThemedText
        numberOfLines={isSubtitleExpanded ? undefined : 2}
        style={[styles.subtitle, { color: colors.textMuted }]}
      >
        {text}
      </ThemedText>
      {!isLoading && showReadMoreButton && (
        <Pressable onPress={() => setIsSubtitleExpanded(!isSubtitleExpanded)}>
          <ThemedText style={[styles.readMoreText, { color: colors.primary }]}>
            {isSubtitleExpanded ? "Show less" : "Read more"}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
};

export default ExpandableText;

const styles = StyleSheet.create({
  readMoreText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 32,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
});
