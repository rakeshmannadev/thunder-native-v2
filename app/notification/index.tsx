import Notification from "@/components/notification/Notification";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useRoomStore from "@/store/useRoomStore";
import React from "react";
import { FlatList, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();
  const { joinRequests } = useRoomStore();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          Colors[colorScheme === "light" ? "light" : "dark"].background,
      }}
    >
      {joinRequests && joinRequests.length > 0 ? (
        <View style={{ marginTop: 64, padding: 10 }}>
          <FlatList
            data={joinRequests}
            renderItem={({ item }) => <Notification request={item} />}
            keyExtractor={(_, idx) => idx.toString()}
          />
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <ThemedText type="defaultSemiBold" className="text-center">
            No requests
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default index;
