import { Colors } from "@/constants/Colors";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

const NoDataPlaceholder = () => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: colors.textMuted,
          letterSpacing: 0.5,
          fontWeight: 700,
        }}
      >
        No data available
      </Text>
    </View>
  );
};

export default NoDataPlaceholder;
