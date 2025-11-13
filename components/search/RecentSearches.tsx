import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { XIcon } from "lucide-react-native";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ButtonText } from "../ui/button";

const RecentSearches = () => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const { top } = useSafeAreaInsets();
  return (
    <View
      className="flex-col gap-4"
      style={{ backgroundColor: colors.background, marginTop: top + 40 }}
    >
      <View className="flex-row justify-between">
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          Recent Searches
        </Text>
        <Button variant="link" action="secondary">
          <ButtonText>Clear All</ButtonText>
        </Button>
      </View>
      <View className="flex-col gap-8 mt-4">
        <SearchItems />
        <SearchItems />
        <SearchItems />
      </View>
    </View>
  );
};

export default RecentSearches;

const SearchItems = () => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  return (
    <View className="flex-row justify-between items-center">
      <View className="flex-row gap-4 justify-center items-center">
        <FontAwesome
          name="history"
          className="p-2  rounded-xl "
          style={{ backgroundColor: colors.secondaryBackground }}
          size={20}
          color={colors.icon}
        />

        <Text className="text-lg" style={{ color: colors.text }}>
          Search Term{" "}
        </Text>
      </View>
      <XIcon size={20} color={colors.icon} />
    </View>
  );
};
