import { CheckIcon, XIcon } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";

const Notification = () => {
  return (
    <Card size="sm" variant="outline" className="rounded-2xl mb-2 ">
      <HStack style={{ justifyContent: "space-between" }}>
        <HStack space="lg" style={{ alignItems: "center" }}>
          <Avatar size="lg">
            <AvatarFallbackText>RM</AvatarFallbackText>
            <AvatarImage source={{ uri: "" }} />
          </Avatar>
          <VStack>
            <Text className="text-lg dark:text-zinc-200 font-bold truncate">
              Rakesh Manna
            </Text>
            <ThemedText type="defaultSemiBold" className="truncate">
              Bedardeya
            </ThemedText>
          </VStack>
        </HStack>

        <HStack space="md" className="h-full" style={{ alignItems: "center" }}>
          <Button
            variant="outline"
            size="md"
            className="rounded-xl bg-gray-200/10 data-[]:active:bg-hover-background "
          >
            <ButtonIcon size="xl" as={CheckIcon} color="green" />
          </Button>
          <Button
            variant="outline"
            size="md"
            className="rounded-xl  bg-gray-200/10 data-[]:active:bg-hover-background  "
          >
            <ButtonIcon size="xl" as={XIcon} color="red" />
          </Button>
        </HStack>
      </HStack>
    </Card>
  );
};

export default Notification;
