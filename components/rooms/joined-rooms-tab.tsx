import JoinedRoom from "@/components/rooms/JoinedRoom";
import { Colors } from "@/constants/Colors";
import { colors, screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { CoffeeIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  useColorScheme,
  View,
} from "react-native";
import FloatingButton from "../FloatingButton";
import RenderSkeleton from "./skeleton";

const JoinedRoomsTab = () => {
  const { rooms, isFetchingRooms, fetchJoinedRooms } = useUserStore();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const router = useRouter();

  useEffect(() => {
    fetchJoinedRooms();
  }, []);

  if (!isFetchingRooms && rooms.length === 0) return <NoRoomsView />;

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: screenPadding.horizontal,
        marginTop: 20,
      }}
    >
      {isFetchingRooms ? (
        <RenderSkeleton length={10} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={rooms}
          renderItem={({ item }) => <JoinedRoom room={item} />}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingRooms}
              onRefresh={fetchJoinedRooms}
              tintColor={colors.primary}
            />
          }
        />
      )}
      <FloatingButton onPress={() => router.push("/create_room")} />
    </View>
  );
};

export default JoinedRoomsTab;

const NoRoomsView = () => {
  return (
    <View className="flex-1 flex-col gap-4 items-center justify-center">
      <CoffeeIcon color={colors.icon} />

      <Text style={{ color: colors.text }}>No Rooms yet.</Text>
      <Text style={{ color: colors.textMuted }}>Join a room now!</Text>
    </View>
  );
};
