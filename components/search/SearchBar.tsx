import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import { Search, X } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";

const SearchBar = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { searchQuery, setSearchQuery } = useMusicStore();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // useFocusEffect fires every time the screen comes into focus,
  // not just on first mount — critical for screens cached by React Navigation.
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: isFocused ? colors.primary : "rgba(255,255,255,0.05)",
            borderWidth: 1,
          },
        ]}
      >
        <Search 
          size={20} 
          color={isFocused ? colors.primary : colors.textMuted} 
          style={styles.icon} 
        />

        <TextInput
          ref={inputRef}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search songs, albums, artists..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          selectionColor={colors.primary}
          style={[styles.input, { color: colors.text }]}
        />

        {searchQuery.trim().length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={[styles.clearBtn, { backgroundColor: colors.background }]}
            activeOpacity={0.7}
          >
            <X size={14} color={colors.textMuted} strokeWidth={3} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingVertical: 8,
    paddingRight: 16,
    width: '100%',
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 52,
    marginLeft: 40,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 0,
    height: '100%',
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default SearchBar;
