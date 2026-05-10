import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { History, X } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const RecentSearches = () => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  // Dummy data for demonstration as requested to redesign without changing functionality
  const recentItems = ["Arjit Singh", "The Weeknd", "Global Top 50"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Recent Searches</ThemedText>
        <TouchableOpacity>
          <ThemedText style={[styles.clearAll, { color: colors.primary }]}>
            Clear All
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {recentItems.map((item, index) => (
          <SearchItem key={index} term={item} />
        ))}
      </View>
    </View>
  );
};

const SearchItem = ({ term }: { term: string }) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.historyCircle,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          <History size={16} color={colors.textMuted} />
        </View>
        <ThemedText style={styles.itemText}>{term}</ThemedText>
      </View>
      <TouchableOpacity style={styles.removeBtn}>
        <X size={16} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  clearAll: {
    fontSize: 14,
    fontWeight: "700",
  },
  list: {
    gap: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  removeBtn: {
    padding: 4,
  },
});

export default RecentSearches;
