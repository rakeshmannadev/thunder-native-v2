import PublicRoom from "@/components/rooms/PublicRoom";
import { Input, InputField } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { ArrowRight, Radio, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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

const PublicRoomsTab = () => {
  const { publicRooms, isFetchingRooms, fetchPublicRooms } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  const filteredRooms = publicRooms.filter((room) =>
    room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isFetchingRooms && publicRooms.length === 0) return <NoRoomsView />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Modern Search Bar */}
      <View style={styles.searchWrapper}>
        <Input
          style={[
            styles.searchInput,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          <View style={styles.searchIconContainer}>
            <Search size={20} color={colors.textMuted} />
          </View>
          <InputField
            placeholder="Search for live rooms..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ color: colors.text }}
            placeholderTextColor={colors.textMuted}
          />
        </Input>
      </View>

      {isFetchingRooms ? (
        <View style={{ paddingHorizontal: screenPadding.horizontal }}>
          <RenderSkeleton length={10} />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredRooms}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 100).duration(600)}
            >
              <PublicRoom room={item} />
            </Animated.View>
          )}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingRooms}
              onRefresh={fetchPublicRooms}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const NoRoomsView = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

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

      <ThemedText style={styles.noRoomsTitle}>No Public Rooms</ThemedText>
      <ThemedText style={[styles.noRoomsSubtitle, { color: colors.textMuted }]}>
        Be the first one to start a broadcast and invite others to join your
        room!
      </ThemedText>

      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
        onPress={() => router.push("/create_room")}
      >
        <ThemedText style={styles.actionBtnText}>Create a Room</ThemedText>
        <ArrowRight size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: 16,
  },
  searchInput: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
  },
  searchIconContainer: {
    marginRight: 8,
    paddingLeft: 4,
  },
  listContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingBottom: 40,
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

export default PublicRoomsTab;
