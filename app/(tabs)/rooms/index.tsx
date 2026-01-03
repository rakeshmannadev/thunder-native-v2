import { Divider } from "@/components/ui/divider";
import { Colors } from "@/constants/Colors";
import { fontSize, screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
import JoinedRoomsTab from "../../../components/rooms/joined-rooms-tab";
import PublicRoomsTab from "../../../components/rooms/public-rooms-tab";

const index = () => {
  const layout = useWindowDimensions();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top } = useSafeAreaInsets();

  const { currentUser } = useUserStore();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "joined", title: "Joined Rooms" },
    { key: "public", title: "Explore Rooms" },
  ]);

  const LazySceneRender = ({ route }: any) => {
    if (route.key === "joined") return <JoinedRoomsTab />;
    if (route.key === "public") return <PublicRoomsTab />;
    return null;
  };

  const renderTabBar = () => (
    <>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: screenPadding.horizontal,
        }}
      >
        {routes.map((route, i) => {
          const isActive = index === i;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => setIndex(i)}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: isActive ? 2 : 0,
                borderBottomColor: colors.accent,
              }}
            >
              <Text
                style={{
                  color: isActive ? colors.accent : colors.textMuted,
                  fontSize: fontSize.sm,
                }}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ paddingHorizontal: screenPadding.horizontal }}>
        <Divider />
      </View>
    </>
  );

  if (!currentUser) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: top + 40, flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={LazySceneRender}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
          swipeEnabled
          lazy
          lazyPreloadDistance={0}
        />
      </View>
    </SafeAreaView>
  );
};

export default index;
