import MenuModal, { MenuItem } from "@/components/MenuModal";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import usePlayerStore from "@/store/usePlayerStore";
import {
  Download,
  Headphones,
  Moon,
  Music,
  Palette,
  Settings,
  Sun,
} from "lucide-react-native";
import React, { useState } from "react";
import {
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

const SettingsScreen = () => {
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

  const SettingItem = ({
    icon: Icon,
    label,
    value,
    onPress,
    iconBg,
  }: {
    icon: any;
    label: string;
    value: string;
    onPress: () => void;
    iconBg?: string;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.settingItem,
        { backgroundColor: colors.secondaryBackground + "40" },
      ]}
    >
      <View style={styles.settingItemLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconBg || colors.primary + "20" },
          ]}
        >
          <Icon size={20} color={iconBg ? "white" : colors.primary} />
        </View>
        <View>
          <ThemedText style={styles.settingLabel}>{label}</ThemedText>
          <ThemedText
            style={[styles.settingValue, { color: colors.textMuted }]}
          >
            {value}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({
    title,
    icon: Icon,
  }: {
    title: string;
    icon: any;
  }) => (
    <View style={styles.sectionHeader}>
      <Icon size={18} color={colors.primary} />
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: top + 20 }]}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <ThemedText style={styles.pageTitle}>Settings</ThemedText>
        </Animated.View>

        {/* Appearance section */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.section}
        >
          <SectionHeader title="Appearance" icon={Palette} />
          <SettingItem
            icon={colorScheme === "dark" ? Moon : Sun}
            label="Theme"
            value={colorScheme === "dark" ? "Dark Mode" : "Light Mode"}
            onPress={() =>
              openMenu(
                [
                  { key: "light", label: "Light", icon: "sun" },
                  { key: "dark", label: "Dark", icon: "moon" },
                ],
                "Appearance"
              )
            }
          />
        </Animated.View>

        {/* Playback section */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(300)}
          style={styles.section}
        >
          <SectionHeader title="Playback" icon={Music} />
          <SettingItem
            icon={Download}
            label="Audio Preference"
            value={
              audioPreference.downloadFirst ? "Download First" : "Streaming"
            }
            onPress={() =>
              openMenu(
                [
                  {
                    key: "download_first",
                    label: "Download first",
                    icon: "download",
                  },
                  { key: "streaming", label: "Streaming", icon: "mug" },
                ],
                "Audio Preference"
              )
            }
          />
          <SettingItem
            icon={Headphones}
            label="Audio Quality"
            value={
              audioPreference.quality.charAt(0).toUpperCase() +
              audioPreference.quality.slice(1)
            }
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
          />
        </Animated.View>

        {/* About Section */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={styles.section}
        >
          <SectionHeader title="System" icon={Settings} />
          <SettingItem
            icon={Settings}
            label="Version"
            value="2.0.0 (Thunder Native)"
            onPress={() => {}}
            iconBg="#6366f1"
          />
        </Animated.View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 32,
    letterSpacing: -1,
    lineHeight: 38,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    opacity: 0.6,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 13,
    fontWeight: "600",
  },
});

export default SettingsScreen;
