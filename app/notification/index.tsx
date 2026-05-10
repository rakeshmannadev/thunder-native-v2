import Notification from "@/components/notification/Notification";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useRoomStore from "@/store/useRoomStore";
import { Inbox } from "lucide-react-native";
import React from "react";
import { FlatList, StyleSheet, useColorScheme, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const NotificationScreen = () => {
  const colorScheme = useColorScheme();
  const { joinRequests } = useRoomStore();
  const { top } = useSafeAreaInsets();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.content, { paddingTop: top + 10 }]}>
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.header}
        >
          <ThemedText style={styles.pageTitle}>Notifications</ThemedText>
          <View
            style={[styles.badge, { backgroundColor: colors.primary + "20" }]}
          >
            <ThemedText style={[styles.badgeText, { color: colors.primary }]}>
              {joinRequests?.length || 0} NEW
            </ThemedText>
          </View>
        </Animated.View>

        {joinRequests && joinRequests.length > 0 ? (
          <FlatList
            data={joinRequests}
            renderItem={({ item, index }) => (
              <Notification request={item} index={index} />
            )}
            keyExtractor={(_, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.emptyContainer}
          >
            <View
              style={[
                styles.emptyIconBg,
                { backgroundColor: colors.secondaryBackground },
              ]}
            >
              <Inbox size={48} color={colors.textMuted} />
            </View>
            <ThemedText style={styles.emptyTitle}>All caught up!</ThemedText>
            <ThemedText
              style={[styles.emptySubtitle, { color: colors.textMuted }]}
            >
              You have no pending join requests at the moment.
            </ThemedText>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    marginTop: 20,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 38,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});

export default NotificationScreen;
