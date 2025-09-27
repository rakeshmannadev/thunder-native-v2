import Notification from "@/components/notification/Notification";
import { Colors } from "@/constants/Colors";
import React from "react";
import { ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          Colors[colorScheme === "light" ? "light" : "dark"].background,
      }}
    >
      <ScrollView style={{ marginTop: 64, padding: 10 }}>
        <Notification />
        <Notification />
        <Notification />
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
