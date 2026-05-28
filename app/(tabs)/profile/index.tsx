import MenuModal from "@/components/MenuModal";
import ProfileCard from "@/components/profile/ProfileCard";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import { removeToken } from "@/helpers/auth.helper";
import { clearCachedToken } from "@/lib/axios";
import { logout } from "@/services/authServices";
import useUserStore from "@/store/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Globe,
  HelpCircle,
  LogOut,
  Palette,
  Settings,
  Shield,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();

  const [menuVisible, setMenuVisible] = useState(false);

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setCurrentUser(null);
      removeToken("user");
      removeToken("accessToken");
      clearCachedToken();
    },
  });

  const menuGroups = [
    {
      title: "Personal",
      items: [
        {
          label: "Edit Profile",
          icon: User,
          onPress: () => null,
        },
        { label: "My Posts", icon: Globe, onPress: () => null },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          label: "Appearance",
          icon: Palette,
          onPress: () => setMenuVisible(true),
        },
        {
          label: "Settings",
          icon: Settings,
          onPress: () => router.push("/settings"),
        },
      ],
    },
    {
      title: "More",
      items: [
        { label: "Privacy & Security", icon: Shield, onPress: () => null },
        { label: "Help & Support", icon: HelpCircle, onPress: () => null },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 40 }}
      >
        {/* Header Background */}
        <LinearGradient
          colors={[colors.primary + "40", "transparent"]}
          style={[styles.headerBg, { height: 280 + top }]}
        />

        <View style={[styles.content, { marginTop: top + 20 }]}>
          {/* Profile Card Section */}
          <Animated.View entering={FadeIn.duration(800)}>
            <ProfileCard />
          </Animated.View>

          {/* Menu Sections */}
          <View style={styles.menuContainer}>
            {menuGroups.map((group, groupIndex) => (
              <Animated.View
                key={group.title}
                entering={FadeInDown.delay(200 + groupIndex * 100).duration(
                  600
                )}
                style={styles.groupContainer}
              >
                <ThemedText
                  style={[styles.groupTitle, { color: colors.textMuted }]}
                >
                  {group.title}
                </ThemedText>
                <View
                  style={[
                    styles.groupContent,
                    { backgroundColor: colors.secondaryBackground },
                  ]}
                >
                  {group.items.map((item, index) => (
                    <React.Fragment key={item.label}>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={item.onPress}
                        activeOpacity={0.7}
                      >
                        <View style={styles.menuItemLeft}>
                          <View
                            style={[
                              styles.iconWrapper,
                              { backgroundColor: colors.background },
                            ]}
                          >
                            <item.icon size={20} color={colors.primary} />
                          </View>
                          <ThemedText style={styles.menuItemLabel}>
                            {item.label}
                          </ThemedText>
                        </View>
                        <ChevronRight size={20} color={colors.icon} />
                      </TouchableOpacity>
                      {index < group.items.length - 1 && (
                        <View
                          style={[
                            styles.divider,
                            { backgroundColor: colors.borderColor },
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Logout Button */}
          {currentUser && (
            <Animated.View entering={FadeInDown.delay(600).duration(600)}>
              <TouchableOpacity
                style={[styles.logoutBtn, { borderColor: "#ff4b2b" }]}
                onPress={() => logoutMutation()}
                activeOpacity={0.7}
              >
                <LogOut size={20} color="#ff4b2b" />
                <ThemedText style={styles.logoutText}>Log Out</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={[
          { key: "light", label: "Light theme", icon: "sun" },
          { key: "dark", label: "Dark theme", icon: "moon" },
        ]}
        title="Choose Theme"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    paddingHorizontal: screenPadding.horizontal,
  },
  menuContainer: {
    marginTop: 32,
    gap: 24,
  },
  groupContainer: {
    gap: 12,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  groupContent: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    opacity: 0.1,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 48,
    marginBottom: 20,
    paddingVertical: 18,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(217, 48, 37, 0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(217, 48, 37, 0.2)",
  },
  logoutText: {
    color: "#D93025",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});

export default ProfileScreen;
