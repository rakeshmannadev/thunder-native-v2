import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import { useRouter } from "expo-router";
import { SearchIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";

const SearchBox = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const router = useRouter();

  return (
    <View
      className="w-full"
      style={{ paddingHorizontal: screenPadding.horizontal, paddingBlock: 4 }}
      onTouchEnd={() => router.push("/search")}
    >
      <Input
        variant="rounded"
        isReadOnly={true}
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

export default SearchBox;
