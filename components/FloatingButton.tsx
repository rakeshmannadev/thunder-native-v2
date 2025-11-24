import { Colors } from "@/constants/Colors";
import { PlusIcon } from "lucide-react-native";
import { useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ButtonIcon } from "./ui/button";

const FloatingButton = ({ onPress }: { onPress: () => void }) => {
  const { bottom } = useSafeAreaInsets();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  return (
    <View style={{ bottom: bottom + 30 }} className="absolute right-4">
      <View className=" w-20 h-20 rounded-full justify-center items-center shadow-lg">
        <Button
          onPress={onPress}
          size="lg"
          variant="solid"
          action="primary"
          className="p-[11px] rounded-full"
          style={{ backgroundColor: colors.primary }}
        >
          <ButtonIcon as={PlusIcon} />
        </Button>
      </View>
    </View>
  );
};

export default FloatingButton;
