// app/menu-modal.tsx

import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

// Optional: define type for params
type MenuModalParams = {
  title?: string;
  actionKey?: string;
  iconKey?: string;
};

export default function MenuModal() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams<MenuModalParams>();

  const { title, actionKey, iconKey } = params;

  // resolve icon from iconKey, action from actionKey (use registry as before)
  // For now, we’ll make a simple example

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
      <Text style={styles.title}>{title ?? "Options"}</Text>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          console.log("Action pressed", actionKey);
          router.back(); // dismiss modal
        }}
      >
        <Text style={styles.itemText}>Some Action</Text>
      </TouchableOpacity>

      {/* Add more items as needed */}
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
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
  },
});
