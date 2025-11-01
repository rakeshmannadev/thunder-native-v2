// app/menu.tsx
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ICON_MAPS } from "@/constants/Icons";
import useMenuActions from "@/hooks/useMenuActions";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export interface menuItems {
  key: string;
  data?: any;
  label: string;
  destructive?: boolean;
  icon?: string | null;
}

export default function MenuSheet() {
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const params = useLocalSearchParams();

  const { handleMenuActions } = useMenuActions();

  let menuItems: menuItems[] = [];
  try {
    menuItems = JSON.parse(params.items as any);
  } catch (error) {
    console.log("Error parsing menu items:", error);
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.handle,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.25)"
                : "rgba(201, 201, 201)",
          },
        ]}
      />
      <ThemedText style={styles.title}>
        {params.title ?? "Song Options"}
      </ThemedText>

      {menuItems.map((item, index) => {
        const iconName = item?.icon ? item.icon : null;
        const Icon = iconName ? ICON_MAPS[iconName as string] : null;

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => {
              handleMenuActions(item.key, item.data);
              // router.canGoBack(); // close sheet
            }}
          >
            <View style={styles.item}>
              {Icon && (
                <Icon
                  size={20}
                  color={
                    item?.destructive
                      ? "#ff6b6b"
                      : colorScheme === "light"
                      ? "black"
                      : "white"
                  }
                />
              )}
              <ThemedText style={[item?.destructive && { color: "#ff6b6b" }]}>
                {item.label}
              </ThemedText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  handle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
});
