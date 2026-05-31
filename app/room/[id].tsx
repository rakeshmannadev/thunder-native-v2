import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { getRoomById } from "@/services/roomServices";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Radio } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatHeader from "./_components/chat-header";
import ChatInput from "./_components/chat-input";
import ChatSection from "./_components/chat-section";
import CurrentlyBroadcastSong from "./_components/currently-broadcast-song";

// ─── Skeleton shimmer hook ────────────────────────────────────────────────────
const useShimmer = () => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900 }),
        withTiming(0.4, { duration: 900 })
      ),
      -1,
      false
    );
  }, []);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};

// ─── Skeleton pieces ──────────────────────────────────────────────────────────
const SkeletonBox = ({
  width,
  height,
  borderRadius = 12,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) => {
  const shimmer = useShimmer();
  const colorScheme = useColorScheme();
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
        },
        shimmer,
        style,
      ]}
    />
  );
};

const RoomSkeleton = ({ colors }: { colors: any }) => (
  <View
    style={[styles.skeletonContainer, { backgroundColor: colors.background }]}
  >
    <LinearGradient
      colors={[colors.primary + "40", colors.background]}
      style={StyleSheet.absoluteFill}
    />

    {/* Header skeleton */}
    <View style={styles.skeletonHeader}>
      <SkeletonBox width={40} height={40} borderRadius={20} />
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}
      >
        <SkeletonBox width={44} height={44} borderRadius={14} />
        <View style={{ gap: 6 }}>
          <SkeletonBox width={120} height={14} borderRadius={7} />
          <SkeletonBox width={80} height={10} borderRadius={5} />
        </View>
      </View>
      <SkeletonBox width={40} height={40} borderRadius={20} />
    </View>

    {/* Broadcast card skeleton */}
    <View
      style={[
        styles.skeletonCard,
        { marginHorizontal: screenPadding.horizontal, marginVertical: 12 },
      ]}
    >
      <View style={{ flex: 1, gap: 10 }}>
        <SkeletonBox width={100} height={10} borderRadius={5} />
        <SkeletonBox width="80%" height={16} borderRadius={8} />
        <SkeletonBox width="60%" height={12} borderRadius={6} />
      </View>
      <SkeletonBox width={56} height={56} borderRadius={12} />
    </View>

    {/* Chat bubbles skeleton */}
    <View
      style={[
        styles.skeletonChat,
        { marginHorizontal: screenPadding.horizontal },
      ]}
    >
      {/* Incoming message */}
      <View style={styles.skeletonBubbleRow}>
        <SkeletonBox width={34} height={34} borderRadius={17} />
        <View style={{ gap: 6 }}>
          <SkeletonBox width={60} height={10} borderRadius={5} />
          <SkeletonBox width={180} height={40} borderRadius={20} />
        </View>
      </View>
      {/* My message */}
      <View
        style={[styles.skeletonBubbleRow, { flexDirection: "row-reverse" }]}
      >
        <SkeletonBox width={34} height={34} borderRadius={17} />
        <View style={{ gap: 6, alignItems: "flex-end" }}>
          <SkeletonBox width={40} height={10} borderRadius={5} />
          <SkeletonBox width={220} height={52} borderRadius={20} />
        </View>
      </View>
      {/* Incoming message */}
      <View style={styles.skeletonBubbleRow}>
        <SkeletonBox width={34} height={34} borderRadius={17} />
        <View style={{ gap: 6 }}>
          <SkeletonBox width={70} height={10} borderRadius={5} />
          <SkeletonBox width={140} height={40} borderRadius={20} />
        </View>
      </View>
      {/* My message */}
      <View
        style={[styles.skeletonBubbleRow, { flexDirection: "row-reverse" }]}
      >
        <SkeletonBox width={34} height={34} borderRadius={17} />
        <View style={{ gap: 6, alignItems: "flex-end" }}>
          <SkeletonBox width={40} height={10} borderRadius={5} />
          <SkeletonBox width={160} height={40} borderRadius={20} />
        </View>
      </View>
    </View>

    {/* Input skeleton */}
    <View
      style={[
        styles.skeletonInput,
        { marginHorizontal: screenPadding.horizontal },
      ]}
    >
      <SkeletonBox width={40} height={40} borderRadius={20} />
      <SkeletonBox
        width="70%"
        height={40}
        borderRadius={20}
        style={{ flex: 1 }}
      />
      <SkeletonBox width={40} height={40} borderRadius={20} />
    </View>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const RoomScreen = () => {
  const id = useLocalSearchParams().id as string;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { currentUser } = useUserStore();
  const { isJoined, joinRoom, socket, connectSocket } = useSocketStore();

  const { data: currentRoom, isPending: fetchingRoom } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoomById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (!socket && currentUser) {
      connectSocket(currentUser?._id);
    }
  }, [currentUser, connectSocket, socket]);

  useEffect(() => {
    if (currentUser && id && !isJoined && socket) {
      joinRoom(currentUser._id, id);
    }
  }, [currentUser, id, isJoined, socket]);

  if (fetchingRoom) return <RoomSkeleton colors={colors} />;

  if (!currentRoom && !fetchingRoom) return <NoRoomFound />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <LinearGradient
          colors={[colors.primary + "40", colors.background]}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          entering={FadeIn.duration(800)}
          style={styles.headerWrapper}
        >
          <ChatHeader room={currentRoom!} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.songWrapper}
        >
          <CurrentlyBroadcastSong currentRoom={currentRoom} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(800)}
          style={styles.chatWrapper}
        >
          <ChatSection messages={currentRoom!.messages} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(800)}>
          <ChatInput currentRoom={currentRoom!} />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const NoRoomFound = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();

  return (
    <View
      style={[styles.noRoomContainer, { backgroundColor: colors.background }]}
    >
      <Animated.View
        entering={FadeIn.duration(1000)}
        style={styles.noRoomIllustration}
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
          <Radio size={48} color={colors.primary} />
        </View>
      </Animated.View>

      <ThemedText style={styles.noRoomTitle}>Room Not Found</ThemedText>
      <ThemedText style={[styles.noRoomSubtitle, { color: colors.textMuted }]}>
        The broadcast might have ended or the link is invalid.
      </ThemedText>

      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/rooms")}
      >
        <ArrowLeft size={20} color="white" />
        <ThemedText style={styles.backBtnText}>Browse Other Rooms</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Skeleton
  skeletonContainer: {
    flex: 1,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  skeletonChat: {
    flex: 1,
    gap: 20,
    marginTop: 8,
  },
  skeletonBubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  skeletonInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 28,
    marginVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  // Main Layout
  container: {
    flex: 1,
  },
  headerWrapper: {
    zIndex: 10,
  },
  songWrapper: {
    marginTop: 8,
    marginBottom: 4,
  },
  chatWrapper: {
    flex: 1,
    marginHorizontal: screenPadding.horizontal,
    marginTop: 8,
  },
  // No Room Found Styles
  noRoomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: screenPadding.horizontal,
  },
  noRoomIllustration: {
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
  },
  noRoomTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
  },
  noRoomSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  backBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default RoomScreen;
