import EmptyRooms from "@/components/EmptyRooms";
import { Colors } from "@/constants/Colors";
import { fontSize, screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
import JoinedRoomsTab from "../../../components/rooms/joined-rooms-tab";
import PublicRoomsTab from "../../../components/rooms/public-rooms-tab";

const index = () => {
  const layout = useWindowDimensions();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const { currentUser } = useUserStore();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "joined", title: "Joined Rooms" },
    { key: "public", title: "Explore Rooms" },
  ]);

  const LazySceneRender = ({ route }: any) => {
    if (route.key === "joined") return <JoinedRoomsTab setIndex={setIndex} />;
    if (route.key === "public") return <PublicRoomsTab />;
    return null;
  };

  if (!currentUser) return <EmptyRooms />;

  const renderTabBar = () => (
    <View
      style={{ paddingHorizontal: screenPadding.horizontal, marginBottom: 16 }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.secondaryBackground,
          borderRadius: 16,
          padding: 4,
          borderWidth: 1,
          borderColor:
            colorScheme === "dark"
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.03)",
        }}
      >
        {routes.map((route, i) => {
          const isActive = index === i;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => setIndex(i)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: isActive
                  ? colorScheme === "dark"
                    ? "#1e293b"
                    : "#ffffff"
                  : "transparent",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: isActive ? 2 : 0 },
                shadowOpacity: isActive ? 0.08 : 0,
                shadowRadius: isActive ? 4 : 0,
                elevation: isActive ? 2 : 0,
              }}
            >
              <Text
                style={{
                  color: isActive ? colors.primary : colors.textMuted,
                  fontSize: fontSize.sm,
                  fontWeight: "700",
                  letterSpacing: -0.2,
                }}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Premium Header */}
      <View
        style={{
          paddingHorizontal: screenPadding.horizontal,
          paddingTop: top + 16,
          paddingBottom: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "900",
              color: colors.text,
              letterSpacing: -0.8,
            }}
          >
            Listening Rooms
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.textMuted,
              fontWeight: "500",
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            Sync, listen, and chat with friends in real-time
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/create_room")}
          activeOpacity={0.8}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: colors.secondaryBackground,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Plus color={colors.text} size={20} />
        </TouchableOpacity>
      </View>

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
  );
};

export default index;
