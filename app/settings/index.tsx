import { ThemedText } from "@/components/ThemedText";
import MenuModal, { MenuItem } from "@/components/MenuModal";
import { Colors } from "@/constants/Colors";
import {
  borderRadius,
  colors as constantColors,
  fontSize,
  screenPadding,
} from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import { defaultStyles } from "@/styles";
import { FontAwesome } from "@expo/vector-icons";
import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();

  const { audioPreference } = usePlayerStore();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuTitle, setMenuTitle] = useState("Options");

  const openMenu = (items: MenuItem[], title: string) => {
    setMenuItems(items);
    setMenuTitle(title);
    setMenuVisible(true);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView style={[styles.scrollContent, { paddingTop: top + 60 }]}>
        <View style={styles.scrollContent}>
          {/* Appearance section */}
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle">Appreance</ThemedText>
            <TouchableOpacity
              onPress={() =>
                openMenu(
                  [
                    { key: "light", label: "Light", icon: "sun" },
                    { key: "dark", label: "Dark", icon: "moon" },
                  ],
                  "Appearance"
                )
              }
              className="w-full flex flex-row justify-between items-center p-4"
              style={{
                backgroundColor: colors.component,
                borderRadius: borderRadius.md,
              }}
            >
              <View className="flex flex-row items-center gap-4">
                <FontAwesome
                  name={colorScheme === "dark" ? "moon-o" : "sun-o"}
                  color={colors.icon}
                  size={20}
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: colors.secondaryBackground }}
                />
                <ThemedText type="defaultSemiBold">
                  {colorScheme &&
                    colorScheme?.charAt(0).toUpperCase() +
                      colorScheme?.slice(1)}
                </ThemedText>
              </View>

              <ChevronRight color={colors.icon} />
            </TouchableOpacity>
          </View>

          {/* Playback section */}
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle" darkColor={colors.textMuted}>
              Playback
            </ThemedText>
            {/* Audio preference */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.component,
                borderRadius: borderRadius.md,
              }}
              onPress={() =>
                openMenu(
                  [
                    { key: "download_first", label: "Download first", icon: "download" },
                    { key: "streaming", label: "Streaming", icon: "mug" },
                  ],
                  "Audio Preference"
                )
              }
              className="w-full flex flex-row justify-between items-center rounded-3xl p-4"
            >
              <View className="flex flex-row items-center gap-4">
                <FontAwesome
                  name="cog"
                  color={colors.icon}
                  size={20}
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: colors.secondaryBackground }}
                />
                <ThemedText type="defaultSemiBold">
                  {audioPreference.downloadFirst
                    ? "Downlode First"
                    : "Streaming"}{" "}
                </ThemedText>
              </View>

              <ChevronRight color={colors.icon} />
            </TouchableOpacity>
            {/* Audio quality */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.component,
                borderRadius: borderRadius.md,
              }}
              onPress={() =>
                openMenu(
                  [
                    { key: "low", label: "Low" },
                    { key: "medium", label: "Medium" },
                    { key: "high", label: "High" },
                  ],
                  "Audio Quality"
                )
              }
              className="w-full flex flex-row justify-between items-center rounded-3xl p-4"
            >
              <View className="flex flex-row items-center gap-4">
                <FontAwesome
                  name="headphones"
                  color={colors.icon}
                  size={20}
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: colors.secondaryBackground }}
                />
                <ThemedText type="defaultSemiBold">
                  {audioPreference.quality.charAt(0).toUpperCase() +
                    audioPreference.quality.slice(1)}
                </ThemedText>
              </View>

              <ChevronRight color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        title={menuTitle}
      />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: constantColors.background,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
  },
  sectionContainer: {
    gap: 15,
    marginBottom: 20,
  },
  artworkContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  title: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  artist: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    marginVertical: 6,
  },
  songCount: {
    ...defaultStyles.text,
    fontSize: 14,
    opacity: 0.7,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
