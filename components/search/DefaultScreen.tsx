import { ThemedText } from "@/components/ThemedText";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { SearchIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";

const DefaultScreen = () => {
  const colorSchema = useColorScheme();
  return (
    <VStack
      style={{
        backgroundColor:
          Colors[colorSchema === "light" ? "light" : "dark"].background,
      }}
      space="lg"
      className="flex-1 relative items-center p-5"
    >
      <View className="filter drop-shadow-glow rounded-s-full rounded-t-full rounded-br-3xl ">
        <SearchIcon
          size={60}
          color={colorSchema === "light" ? "black" : "white"}
        />
      </View>

      <VStack space="md" className=" flex-1 items-center justify-center">
        <ThemedText type="title">Search now</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-center">
          Type something to search from millions of songs, albums & artists.
        </ThemedText>
      </VStack>
    </VStack>
  );
};

export default DefaultScreen;
