// app/menu.tsx
import { Colors } from "@/constants/Colors";
import { ICON_MAPS } from "@/constants/Icons";
import useMenuActions from "@/hooks/useMenuActions";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
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
  const router = useRouter();
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
          backgroundColor:
            colorScheme === "light"
              ? Colors["light"].background
              : Colors["dark"].background,
        },
      ]}
    >
      <View style={styles.handle} />
      <Text style={styles.title}>{params.title ?? "Song Options"}</Text>

      {menuItems.map((item, index) => {
        const iconName = item?.icon ? item.icon : null;
        const Icon = iconName ? ICON_MAPS[iconName as string] : null;

        return (
          <TouchableOpacity
            key={index}
            style={styles.item}
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
                  color={item?.destructive ? "#ff6b6b" : "#fff"}
                />
              )}
              <Text
                style={[
                  styles.itemText,
                  item?.destructive && { color: "#ff6b6b" },
                ]}
              >
                {item.label}
              </Text>
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
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
  },
});
