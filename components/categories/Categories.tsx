import { CATEGORIES } from "@/constants/categories";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const Categories = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const [categories, setCategories] = useState(CATEGORIES);
  const { setSelectedCategory } = usePlayerStore();
  return (
    <View style={{ paddingHorizontal: screenPadding.horizontal }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
      >
        {categories &&
          categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className="mr-2"
              onPress={() => {
                setCategories(
                  categories.map((c) =>
                    c.id === category.id
                      ? { ...c, active: !c.active }
                      : { ...c, active: false }
                  )
                );
                setSelectedCategory(category.name.toLowerCase());
              }}
            >
              <View
                style={{
                  backgroundColor: category.active
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
          ))}
      </ScrollView>
    </View>
  );
};

export default Categories;
