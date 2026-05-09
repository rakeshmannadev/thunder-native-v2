import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import { SearchIcon, XCircleIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";

const SearchBar = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { searchQuery, setSearchQuery } = useMusicStore();

  return (
    <View className="pl-10  w-full">
      <Input
        size="lg"
        variant="rounded"
        style={{
          backgroundColor: colors.component,
          borderRadius: borderRadius.lg,
          paddingBlock: 4,
          outline: "none",
          borderWidth: 0,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>

        <InputField
          autoFocus={true}
          placeholder="Search..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          defaultValue={searchQuery}
        />
        {searchQuery.trim().length > 0 && (
          <InputSlot
            className="pr-3"
            onPress={() => {
              setSearchQuery("");
            }}
          >
            <InputIcon as={XCircleIcon} />
          </InputSlot>
        )}
      </Input>
    </View>
  );
};

export default SearchBar;
