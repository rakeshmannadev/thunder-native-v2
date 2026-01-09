import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useDebounceSearch from "@/hooks/useDebouceSearch";
import useMusicStore from "@/store/useMusicStore";
import { SearchIcon, XCircleIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";

const SearchBar = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const [value, setValue] = useState<string>("");
  const { searchSong, setSearchedSongs } = useMusicStore();
  const debouncedValue = useDebounceSearch(value, 1000);

  useEffect(() => {
    if (debouncedValue) {
      searchSong(debouncedValue);
    }
  }, [debouncedValue]);

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
          onChangeText={setValue}
          value={value}
          defaultValue={value}
        />
        {value.trim().length > 0 && (
          <InputSlot
            className="pr-3"
            onPress={() => {
              setValue("");
              setSearchedSongs(null);
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
