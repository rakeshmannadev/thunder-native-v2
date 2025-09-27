import useDebounceSearch from "@/hooks/useDebouceSearch";
import useMusicStore from "@/store/useMusicStore";
import { SearchIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";

const SearchBar = () => {
  const [value, setValue] = useState<string>("");
  const { searchSong } = useMusicStore();
  const debouncedValue = useDebounceSearch(value, 1000);

  useEffect(() => {
    if (debouncedValue) {
      searchSong(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <View className="pl-10  w-full">
      <Input size="lg" variant="rounded" className="bg-gray-400/10 rounded-2xl">
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder="Search..."
          onChangeText={setValue}
          value={value}
        />
      </Input>
    </View>
  );
};

export default SearchBar;
