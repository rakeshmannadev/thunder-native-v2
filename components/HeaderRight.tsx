import { Colors } from "@/constants/Colors";
import useRoomStore from "@/store/useRoomStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { BellDotIcon, BellIcon, SettingsIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { HStack } from "./ui/hstack";

const HeaderRight = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { joinRequests, fetchJoinRequests } = useRoomStore();
  const { rooms, currentUser } = useUserStore();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const userCreatedRooms: string[] = [];

  if (currentUser) {
    rooms.forEach((room) => {
      if (room.admin === currentUser._id) {
        userCreatedRooms.push(room._id);
      }
    });
  }

  useEffect(() => {
    if (currentUser) {
      fetchJoinRequests(userCreatedRooms);
    }
  }, [fetchJoinRequests, userCreatedRooms.length]);

  console.log("joinRequests", joinRequests);

  return (
    <HStack space="md" className="mr-5">
      <Pressable
        onPress={() => router.navigate("/notification")}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: pressed
              ? colors.secondaryBackground
              : "transparent", // Example pressed background color
          },
        ]}
      >
        {({ pressed }) =>
          joinRequests.length === 0 ? (
            <BellIcon size={24} color={pressed ? colors.accent : colors.icon} />
          ) : (
            <BellDotIcon
              size={24}
              color={pressed ? colors.accent : colors.icon}
            />
          )
        }
      </Pressable>

      <Pressable
        onPress={() => {
          router.navigate("/settings");
        }}
      >
        {({ pressed }) => (
          <SettingsIcon
            size={24}
            color={pressed ? colors.accent : colors.icon}
          />
        )}
      </Pressable>
    </HStack>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 50, // For a circular touch area
    justifyContent: "center",
    alignItems: "center",
  },
});
