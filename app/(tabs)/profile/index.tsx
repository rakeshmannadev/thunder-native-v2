import BottomSheetMenu from "@/components/BottomSheetMenu";
import { ThemedText } from "@/components/ThemedText";
import ProfileCard from "@/components/profile/ProfileCard";
import { VStack } from "@/components/ui/vstack";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import {
  ChevronRight,
  GlobeIcon,
  LogOutIcon,
  PaletteIcon,
} from "lucide-react-native";
import React, { useRef } from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  const { currentUser } = useUserStore();
  const { logout } = useAuthStore();
  const nativeScrollGesture = Gesture.Native();
  const menuRef = useRef<View>(null);
  return (
    <SafeAreaView className="flex-1 dark:bg-dark-background p-2">
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
              <GlobeIcon color={colorScheme === "light" ? "black" : "white"} />
              <ThemedText type="defaultSemiBold">Posts</ThemedText>
            </View>

            <ChevronRight color={colorScheme === "light" ? "black" : "white"} />
          </TouchableOpacity>

          {/* Change theme */}

          <TouchableOpacity
            onPress={() => setShowActionsheet(true)}
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

          {/* Logout */}
          {currentUser && (
            <TouchableOpacity
              onPress={logout}
              className="w-full flex flex-row justify-between "
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
      <BottomSheetMenu
        visible={showActionsheet}
        onClose={handleClose}
        items={[
          { label: "Light", onPress: () => console.log("Light theme") },
          { label: "Dark", onPress: () => console.log("Dark theme") },
        ]}
      />
    </SafeAreaView>
  );
};

export default index;
