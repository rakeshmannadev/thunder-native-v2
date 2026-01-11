import { Requests } from "@/types";
import { CheckIcon, XIcon } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";

const Notification = ({ request }: { request: Requests }) => {
  return (
    <Card size="sm" variant="outline" className="rounded-2xl mb-2 ">
      <HStack style={{ justifyContent: "space-between" }}>
        <HStack space="lg" style={{ alignItems: "center" }}>
          <Avatar size="lg">
            <AvatarFallbackText>
              {request.user.userName.charAt(0) +
                request.user.userName.charAt(1)}
            </AvatarFallbackText>
            {/* <AvatarImage source={{ uri: request.user. }} /> */}
          </Avatar>
          <VStack>
            <Text className="text-lg dark:text-zinc-200 font-bold truncate">
              {request.user.userName}
            </Text>
            <ThemedText type="defaultSemiBold" className="truncate">
              {request.room.roomName}
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
