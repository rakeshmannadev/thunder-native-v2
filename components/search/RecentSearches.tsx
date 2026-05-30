import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useMusicStore from "@/store/useMusicStore";
import useSearchStore from "@/store/useSearchStore";
import { History, X } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutLeft } from "react-native-reanimated";

const RecentSearches = () => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const { recentSearches, clearRecentSearches } = useSearchStore();

  if (recentSearches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Recent Searches</ThemedText>
        <TouchableOpacity onPress={clearRecentSearches} activeOpacity={0.7}>
          <ThemedText style={[styles.clearAll, { color: colors.primary }]}>
            Clear All
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {recentSearches.map((item, index) => (
          <Animated.View
            key={item}
            entering={FadeInDown.delay(index * 40).duration(300)}
            exiting={FadeOutLeft.duration(200)}
          >
            <SearchItem term={item} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const SearchItem = ({ term }: { term: string }) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const { setSearchQuery } = useMusicStore();
  const { removeRecentSearch } = useSearchStore();

  const handlePress = () => {
    setSearchQuery(term);
  };

  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={handlePress}>
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
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeRecentSearch(term)}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
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
