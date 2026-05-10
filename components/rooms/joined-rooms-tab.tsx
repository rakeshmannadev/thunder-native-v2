import JoinedRoom from "@/components/rooms/JoinedRoom";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { ArrowRight, Plus, Radio } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import RenderSkeleton from "./skeleton";

const JoinedRoomsTab = ({
  setIndex,
}: {
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { rooms, isFetchingRooms, fetchJoinedRooms } = useUserStore();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();

  useEffect(() => {
    fetchJoinedRooms();
  }, []);

  if (!isFetchingRooms && rooms.length === 0)
    return <NoRoomsView setIndex={setIndex} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isFetchingRooms ? (
        <RenderSkeleton length={10} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={rooms}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 100).duration(600)}
            >
              <JoinedRoom room={item} />
            </Animated.View>
          )}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingRooms}
              onRefresh={fetchJoinedRooms}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      {/* Modern Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/create_room")}
        activeOpacity={0.8}
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
};

const NoRoomsView = ({
  setIndex,
}: {
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();

  return (
    <View
      style={[styles.noRoomsContainer, { backgroundColor: colors.background }]}
    >
      <Animated.View
        entering={FadeIn.duration(1000)}
        style={styles.illustrationContainer}
      >
        <View
          style={[styles.glow, { backgroundColor: colors.primary + "15" }]}
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

      <ThemedText style={styles.noRoomsTitle}>No Rooms Joined</ThemedText>
      <ThemedText style={[styles.noRoomsSubtitle, { color: colors.textMuted }]}>
        Join or create a room to start listening and chatting with your friends
        in real-time.
      </ThemedText>

      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: colors.primary }]}
        onPress={() => setIndex(1)}
      >
        <ThemedText style={styles.actionBtnText}>Discover Rooms</ThemedText>
        <ArrowRight size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: 20,
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  // No Rooms View Styles
  noRoomsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: screenPadding.horizontal,
  },
  illustrationContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  glow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    transform: [{ scale: 1.6 }],
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  noRoomsTitle: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  noRoomsSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  actionBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default JoinedRoomsTab;
