import JoinedRoom from "@/components/rooms/JoinedRoom";
import PublicRoom from "@/components/rooms/PublicRoom";
import { Divider } from "@/components/ui/divider";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import { SearchIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom } = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("joined");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingTop: top + 40,
          flex: 1,
          alignItems: "center",
        }}
      >
        {/* Tabs section */}
        <View
          style={{
            flexDirection: "row",
            paddingInline: screenPadding.horizontal,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            className=" flex-1 justify-center items-center min-h-12 "
            onPress={() => setActiveTab("joined")}
            style={{
              borderBottomWidth: activeTab === "joined" ? 2 : 0,
              borderBottomColor: colors.primary,
            }}
          >
            <Text
              style={{
                color:
                  activeTab === "joined" ? colors.primary : colors.textMuted,
                fontSize: fontSize.sm,
              }}
            >
              Joined Rooms
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-1 justify-center items-center min-h-12"
            onPress={() => setActiveTab("public")}
            style={{
              borderBottomWidth: activeTab === "public" ? 2 : 0,
              borderBottomColor: colors.primary,
            }}
          >
            <Text
              style={{
                color:
                  activeTab === "active" ? colors.primary : colors.textMuted,
                fontSize: fontSize.sm,
              }}
            >
              Active Rooms
            </Text>
          </TouchableOpacity>
        </View>
        {/* Divider section */}
        <View
          style={{
            width: "100%",
            paddingInline: screenPadding.horizontal,
            // marginTop: 12,
          }}
        >
          <Divider />
        </View>

        {/* Joined rooms section */}
        {activeTab === "joined" && (
          <View
            style={{
              paddingHorizontal: screenPadding.horizontal,
              marginTop: 24,
              paddingBottom: bottom + 50,
            }}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={[1, 2, 3, 4, 5]}
              renderItem={({ item }) => <JoinedRoom key={item} />}
              keyExtractor={(item) => item.toString()}
            />
          </View>
        )}

        {/* Public rooms section */}
        {activeTab === "public" && (
          <View
            style={{
              paddingHorizontal: screenPadding.horizontal,
              marginTop: 24,
              paddingBottom: bottom + 68,
            }}
          >
            {/* Search room section */}
            <View
              className="min-w-full"
              style={{
                paddingBlock: 4,
                marginBottom: 16,
              }}
              // onTouchEnd={() => router.push("/search")}
            >
              <Input
                variant="rounded"
                size="xl"
                style={{
                  backgroundColor: colors.component,
                  borderRadius: borderRadius.lg,
                  paddingBlock: 4,
                  outline: "none",
                  borderWidth: 0,
                  shadowColor: colors.text,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}
              >
                <InputSlot className="pl-3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField placeholder="Search rooms..." />
              </Input>
            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              renderItem={({ item }) => <PublicRoom key={item} />}
              keyExtractor={(item) => item.toString()}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default index;
