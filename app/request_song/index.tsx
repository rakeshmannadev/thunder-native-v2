import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import { SearchIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          Colors[colorScheme === "light" ? "light" : "dark"].background,
      }}
    >
      <View style={{ height: top + 40 }} />
      <SearchBox />
    </SafeAreaView>
  );
};

export default index;

const SearchBox = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  return (
    <View
      className="w-full"
      style={{ paddingHorizontal: screenPadding.horizontal, paddingBlock: 4 }}
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
        <InputField placeholder="Search for artists,songs,playlists..." />
      </Input>
    </View>
  );
};
