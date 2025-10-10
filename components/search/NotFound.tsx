import { ThemedText } from "@/components/ThemedText";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { BirdIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";

const NotFound = () => {
  const colorSchema = useColorScheme();
  return (
    <VStack
      style={{
        backgroundColor:
          Colors[colorSchema === "light" ? "light" : "dark"].background,
      }}
      space="lg"
      className="flex-1 justify-center items-center"
    >
      <View className="filter drop-shadow-glow rounded-s-full rounded-t-full rounded-br-3xl  animate-pulse ">
        <BirdIcon className="w-24 h-24 text-green-300 " />
      </View>

      <VStack space="md" className="items-center">
        <ThemedText type="title" darkColor="#86efac" lightColor="#86efac">
          Not found
        </ThemedText>
        <ThemedText type="defaultSemiBold" className="text-center">
          Sorry,the keyword you entered could not
          <br /> be found. Try to check again or search with other keywords.
        </ThemedText>
      </VStack>
    </VStack>
  );
};

export default NotFound;
