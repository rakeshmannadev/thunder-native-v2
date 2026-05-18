import { CATEGORIES } from "@/constants/categories";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const Categories = React.memo(() => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { selectedCategory, setSelectedCategory } = usePlayerStore();

  return (
    <View style={{ paddingHorizontal: screenPadding.horizontal }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
      >
        {CATEGORIES.map((category, index) => {
          const isActive = selectedCategory === category.name.toLowerCase();
          return (
            <TouchableOpacity
              key={index}
              className="mr-2"
              onPress={() => {
                setSelectedCategory(category.name.toLowerCase());
              }}
            >
              <View
                style={{
                  backgroundColor: isActive
                    ? colors.primary
                    : colors.component,
                  borderColor: colors.borderColor,
                }}
                className="px-4 py-2 rounded-full border"
              >
                <Text
                  style={{ color: colors.text }}
                  className="text-sm font-bold"
                >
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

export default Categories;
