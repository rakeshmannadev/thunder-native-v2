import { ThemedText } from "@/components/ThemedText";
import ProfileCard from "@/components/profile/ProfileCard";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  GlobeIcon,
  PaletteIcon,
  SettingsIcon,
} from "lucide-react-native";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top } = useSafeAreaInsets();

  const router = useRouter();
  const { currentUser } = useUserStore();
  const { logout } = useAuthStore();

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <View
        style={{
          zIndex: 10,
          overflow: "visible",
          marginTop: top + 36,
          padding: screenPadding.horizontal,
        }}
        className="flex flex-col gap-10"
      >
        <ProfileCard />

        <VStack space="md">
          {/* Posts */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.component,
              padding: 16,
              borderRadius: borderRadius.md,
            }}
            className="w-full flex flex-row justify-between "
          >
            <View className="flex flex-row gap-4">
              <GlobeIcon color={colors.icon} />
              <ThemedText type="defaultSemiBold">Posts</ThemedText>
            </View>

            <ChevronRight color={colors.icon} />
          </TouchableOpacity>

          {/* Change theme */}

          <TouchableOpacity
            style={{
              backgroundColor: colors.component,
              padding: 16,
              borderRadius: borderRadius.md,
            }}
            onPress={() =>
              router.push({
                pathname: "/menu",
                params: {
                  items: JSON.stringify([
                    {
                      key: "light",
                      label: "Light theme",
                      icon: "sun",
                    },
                    {
                      key: "dark",
                      label: "Dark theme",
                      icon: "moon",
                    },
                  ]),
                },
              })
            }
            className="w-full flex flex-row justify-between "
          >
            <View className="flex flex-row gap-4">
              <PaletteIcon
                color={colorScheme === "light" ? "black" : "white"}
              />
              <ThemedText type="defaultSemiBold">Change theme</ThemedText>
            </View>

            <ChevronRight color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: colors.component,
              padding: 16,
              borderRadius: borderRadius.md,
            }}
            onPress={() => router.push("/settings")}
            className="w-full flex flex-row justify-between "
          >
            <View className="flex flex-row gap-4">
              <SettingsIcon color={colors.icon} />
              <ThemedText type="defaultSemiBold">Settings</ThemedText>
            </View>
            <ChevronRight color={colors.icon} />
          </TouchableOpacity>
        </VStack>
        {/* Logout */}
        {currentUser && (
          <TouchableOpacity
            style={{
              backgroundColor: colors.component,
              padding: 16,
              borderRadius: borderRadius.md,
              alignItems: "center",
            }}
            onPress={logout}
            // className="w-full flex flex-row justify-between "
          >
            <ThemedText
              type="defaultSemiBold"
              darkColor="#D93025"
              lightColor="#D93025"
            >
              Logout
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default index;
