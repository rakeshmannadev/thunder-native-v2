import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Colors } from "@/constants/Colors";
import useUserStore from "@/store/useUserStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Camera, Mail, MapPin, User2Icon } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedText } from "../ThemedText";

const ProfileCard = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { currentUser } = useUserStore();

  if (!currentUser) return <DefaultProfileCard />;

  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.cardContainer}>
      <View
        style={[styles.card, { backgroundColor: colors.secondaryBackground }]}
      >
        {/* Decorative Background Element */}
        <LinearGradient
          colors={[colors.primary + "20", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        />

        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Avatar
              size="2xl"
              style={[styles.avatar, { borderColor: colors.primary }]}
            >
              <AvatarFallbackText>
                {currentUser.name.charAt(0)}
              </AvatarFallbackText>
              <AvatarImage source={{ uri: currentUser.image }} />
            </Avatar>
            <TouchableOpacity
              style={[
                styles.editAvatarBtn,
                { backgroundColor: colors.primary },
              ]}
            >
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Heading
              size="xl"
              style={[styles.userName, { color: colors.text }]}
            >
              {currentUser.name}
            </Heading>
            <View style={styles.infoLine}>
              <Mail size={14} color={colors.textMuted} />
              <ThemedText
                style={[styles.userEmail, { color: colors.textMuted }]}
              >
                {currentUser.email}
              </ThemedText>
            </View>
            <View style={styles.infoLine}>
              <MapPin size={14} color={colors.textMuted} />
              <ThemedText
                style={[styles.userLocation, { color: colors.textMuted }]}
              >
                Global Citizen
              </ThemedText>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.statsRow,
            { backgroundColor: colors.background + "50" },
          ]}
        >
          <StatItem label="Posts" value="81" colors={colors} />
          <View
            style={[
              styles.statDivider,
              { backgroundColor: colors.borderColor },
            ]}
          />
          <StatItem
            label="Followers"
            value={currentUser.followers ?? 0}
            colors={colors}
          />
          <View
            style={[
              styles.statDivider,
              { backgroundColor: colors.borderColor },
            ]}
          />
          <StatItem
            label="Following"
            value={currentUser.following ?? 0}
            colors={colors}
          />
        </View>

        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/profile/edit")}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.editBtnText}>Edit Profile</ThemedText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const StatItem = ({ label, value, colors }: any) => (
  <View style={styles.statItem}>
    <ThemedText style={[styles.statValue, { color: colors.text }]}>
      {value}
    </ThemedText>
    <ThemedText style={[styles.statLabel, { color: colors.textMuted }]}>
      {label}
    </ThemedText>
  </View>
);

const DefaultProfileCard = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.secondaryBackground, padding: 32 },
      ]}
    >
      <View style={styles.defaultContent}>
        <View
          style={[styles.defaultAvatar, { backgroundColor: colors.background }]}
        >
          <User2Icon size={48} color={colors.primary} />
        </View>
        <Heading
          size="xl"
          style={[styles.defaultTitle, { color: colors.text }]}
        >
          Join Thunder
        </Heading>
        <ThemedText
          style={[styles.defaultSubtitle, { color: colors.textMuted }]}
        >
          Login to sync your music and follow your favorite artists.
        </ThemedText>
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/auth/Login")}
        >
          <ThemedText style={styles.loginBtnText}>Login</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    borderWidth: 3,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: "500",
  },
  userLocation: {
    fontSize: 13,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 24,
    opacity: 0.3,
  },
  editBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
  // Default State Styles
  defaultContent: {
    alignItems: "center",
    gap: 16,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  defaultTitle: {
    fontWeight: "900",
  },
  defaultSubtitle: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  loginBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  loginBtnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 17,
  },
});

export default ProfileCard;
