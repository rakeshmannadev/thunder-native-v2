import { ThemedText } from "@/components/ThemedText";
import ProfileCard from "@/components/profile/ProfileCard";
import ThemeSheet from "@/components/profile/ThemeSheet";
import { VStack } from "@/components/ui/vstack";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import {
  ChevronRight,
  GlobeIcon,
  LogOutIcon,
  PaletteIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  const { currentUser } = useUserStore();
  const { logout } = useAuthStore();
  return (
    <SafeAreaView className="flex-1 dark:bg-dark-background p-2">
      <VStack space="2xl" className="mt-16">
        <ProfileCard />

        <VStack space="4xl">
          {/* Posts */}
          <Pressable
            style={({ pressed }) => [
              {
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 16,
                backgroundColor: pressed ? "#2A2A2A" : "transparent", // pressed state
              },
            ]}
          >
            <View className="flex flex-row items-center justify-between ">
              <View className="flex flex-row gap-4 items-center">
                <GlobeIcon />
                <ThemedText type="subtitle">Posts</ThemedText>
              </View>

              <ChevronRight />
            </View>
          </Pressable>

          {/* Change theme */}

          <Pressable
            onPress={() => setShowActionsheet(true)}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 16,
                backgroundColor: pressed ? "#2A2A2A" : "transparent", // pressed state
              },
            ]}
          >
            <View className="flex flex-row items-center justify-between ">
              <View className="flex flex-row gap-4 items-center">
                <PaletteIcon />
                <ThemedText type="subtitle">Theme mode</ThemedText>
              </View>
              <ChevronRight />
            </View>
          </Pressable>

          {/* Logout */}
          {currentUser && (
            <Pressable
              onPress={() => logout()}
              className="flex flex-1 flex-row justify-between items-center p-3 hover:bg-hover-background rounded-2xl "
            >
              <View className="flex flex-row items-center gap-5 text-green-500">
                <LogOutIcon />
                <ThemedText
                  type="subtitle"
                  lightColor="#22c55e"
                  darkColor="#22c55e"
                >
                  Log out
                </ThemedText>
              </View>
            </Pressable>
          )}
        </VStack>
        <ThemeSheet
          showActionsheet={showActionsheet}
          handleClose={handleClose}
        />
      </VStack>
    </SafeAreaView>
  );
};

export default index;
