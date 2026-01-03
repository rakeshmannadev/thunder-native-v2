import PublicRoom from "@/components/rooms/PublicRoom";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { borderRadius, colors, screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { CoffeeIcon, SearchIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  useColorScheme,
  View,
} from "react-native";
import RenderSkeleton from "./skeleton";
const PublicRoomsTab = () => {
  const { publicRooms, isFetchingRooms, fetchPublicRooms } = useUserStore();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  if (!isFetchingRooms && publicRooms.length === 0) return <NoRoomsView />;

  return (
    <View style={{ flex: 1, paddingHorizontal: screenPadding.horizontal }}>
      <View className="min-w-full my-4">
        <Input
          variant="rounded"
          size="xl"
          style={{
            backgroundColor: colors.component,
            borderRadius: borderRadius.lg,
            paddingBlock: 4,
            borderWidth: 0,
          }}
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Search rooms..." />
        </Input>
      </View>

      {isFetchingRooms ? (
        <RenderSkeleton length={10} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={publicRooms}
          renderItem={({ item }) => <PublicRoom room={item} />}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingRooms}
              onRefresh={fetchPublicRooms}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

export default PublicRoomsTab;

const NoRoomsView = () => {
  return (
    <View className="flex-1 flex-col gap-4 items-center justify-center">
      <CoffeeIcon color={colors.icon} />

      <Text style={{ color: colors.text }}>No Rooms yet.</Text>
      <Text style={{ color: colors.textMuted }}>
        Be first to create a room!
      </Text>
    </View>
  );
};
