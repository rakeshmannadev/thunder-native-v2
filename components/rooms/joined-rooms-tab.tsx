import JoinedRoom from "@/components/rooms/JoinedRoom";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import React, { useEffect } from "react";
import { FlatList, RefreshControl, useColorScheme, View } from "react-native";
import RenderSkeleton from "./skeleton";

const JoinedRoomsTab = () => {
  const { rooms, isFetchingRooms, fetchJoinedRooms } = useUserStore();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  useEffect(() => {
    fetchJoinedRooms();
  }, []);

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
    </View>
  );
};

export default JoinedRoomsTab;
