import { ThemedText } from "@/components/ThemedText";
import ProfileCard from "@/components/profile/ProfileCard";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  GlobeIcon,
  LogOutIcon,
  PaletteIcon,
  SettingsIcon,
} from "lucide-react-native";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const router = useRouter();
  const { currentUser } = useUserStore();
  const { logout } = useAuthStore();

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1 p-2"
    >
      <View
        style={{ zIndex: 10, overflow: "visible" }}
        pointerEvents="box-none"
        className="flex flex-col gap-10 mt-16"
      >
        <ProfileCard />

        <VStack space="4xl" className="p-4">
          {/* Posts */}
          <TouchableOpacity className="w-full flex flex-row justify-between ">
            <View className="flex flex-row gap-4">
              <GlobeIcon color={colors.icon} />
              <ThemedText type="defaultSemiBold">Posts</ThemedText>
            </View>

            <ChevronRight color={colors.icon} />
          </TouchableOpacity>

          {/* Change theme */}

          <TouchableOpacity
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

            <ChevronRight color={colorScheme === "light" ? "black" : "white"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="w-full flex flex-row justify-between "
          >
            <View className="flex flex-row gap-4">
              <SettingsIcon
                color={colorScheme === "light" ? "black" : "white"}
              />
              <ThemedText type="defaultSemiBold">Settings</ThemedText>
            </View>
          </TouchableOpacity>
          {/* Logout */}
          {currentUser && (
            <TouchableOpacity
              onPress={logout}
              // className="w-full flex flex-row justify-between "
            >
              <View className="flex flex-row gap-4">
                <LogOutIcon
                  color={colorScheme === "light" ? "black" : "white"}
                />
                <ThemedText type="defaultSemiBold">Logout</ThemedText>
              </View>
            </TouchableOpacity>
          )}
        </VStack>
      </View>
    </SafeAreaView>
  );
};

export default index;
