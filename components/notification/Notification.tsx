import { Requests } from "@/types";
import { Check, X, Bell } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInRight } from "react-native-reanimated";

const Notification = ({ request, index }: { request: Requests; index: number }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <Animated.View entering={FadeInRight.duration(400).delay(index * 100)}>
      <View style={[styles.card, { backgroundColor: colors.secondaryBackground + '40', borderColor: colors.borderColor }]}>
        <View style={styles.content}>
          <Avatar size="lg" style={styles.avatar}>
            <AvatarFallbackText style={styles.avatarText}>
              {request.user.userName.substring(0, 2).toUpperCase()}
            </AvatarFallbackText>
          </Avatar>
          
          <View style={styles.textContainer}>
            <ThemedText style={styles.userName} numberOfLines={1}>
              {request.user.userName}
            </ThemedText>
            <ThemedText style={[styles.roomName, { color: colors.textMuted }]} numberOfLines={1}>
              Requested to join <ThemedText style={{ color: colors.primary, fontWeight: '700' }}>{request.room.roomName}</ThemedText>
            </ThemedText>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.actionButton, { backgroundColor: '#22c55e20' }]}
          >
            <Check size={20} color="#22c55e" strokeWidth={3} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.actionButton, { backgroundColor: '#ef444420' }]}
          >
            <X size={20} color="#ef4444" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  avatar: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  avatarText: {
    fontWeight: '800',
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  roomName: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Notification;
