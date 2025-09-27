import { ThemedText } from "@/components/ThemedText";
import { VStack } from "@/components/ui/vstack";
import { SearchIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";

const DefaultScreen = () => {
  const colorSchem = useColorScheme();
  return (
    <VStack space="lg" className="relative items-center p-5">
      <View className="filter drop-shadow-glow rounded-s-full rounded-t-full rounded-br-3xl ">
        <SearchIcon
          size={60}
          color={colorSchem === "light" ? "black" : "white"}
        />
      </View>

      <VStack space="md" className="items-center">
        <ThemedText type="title">Search now</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-center">
          Type something to search from millions of songs, albums & artists.
        </ThemedText>
      </VStack>
    </VStack>
  );
};

export default DefaultScreen;
