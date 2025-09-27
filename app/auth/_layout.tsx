import useUserStore from "@/store/useUserStore";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

const _layout = () => {
  const colorScheme = useColorScheme();
  const { currentUser } = useUserStore();

  if (currentUser) return <Redirect href={"/"} />;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
