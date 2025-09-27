import { colors } from "@/constants/tokens";
import { useRouter } from "expo-router";
import { BellIcon, SearchIcon } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { HStack } from "./ui/hstack";

const HeaderRight = () => {
  const router = useRouter();
  return (
    <HStack space="md" className="mr-5">
      <Pressable
        onPress={() => {
          router.navigate("../search");
        }}
      >
        <SearchIcon
          color={colors.icon}
          className="rounded-full hover:bg-hover-background p-1 h-8 w-12"
        />
      </Pressable>
      <Pressable onPress={() => router.navigate("../notification")}>
        <BellIcon
          color={colors.icon}
          className="rounded-full hover:bg-hover-background p-1 h-8 w-12"
        />
      </Pressable>
    </HStack>
  );
};

export default HeaderRight;
