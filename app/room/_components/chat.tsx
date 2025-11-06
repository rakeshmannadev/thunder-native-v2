import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { Message } from "@/types";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";

const Chat = ({ message }: { message: Message }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { currentUser } = useUserStore();

  return (
    <View
      className="flex items-end  min-w-full justify-start  gap-3 mb-4"
      style={{
        flexDirection:
          message.senderId._id === currentUser?._id ? "row-reverse" : "row",
      }}
    >
      <Image
        source={{ uri: message.senderId.image }}
        style={{ width: 40, aspectRatio: 1 }}
        className="bg-center bg-no-repeat  bg-cover rounded-full w-10 shrink-0"
        alt="user-image"
      />
      <View className="flex w-fit flex-col gap-1 items-start ">
        <Text
          className="text-[13px] font-normal leading-normal max-w-[360px]"
          style={{ color: colors.textMuted }}
        >
          {message.senderId.name}
        </Text>
        <Text
          className="text-base font-normal leading-normal flex max-w-[360px]  px-4 py-3 "
          style={{
            color: colors.text,
            backgroundColor:
              message.senderId._id === currentUser?._id
                ? colors.primary
                : colors.secondary,
            borderRadius: borderRadius.lg,
          }}
        >
          {message.message}
        </Text>
      </View>
    </View>
  );
};

export default Chat;
