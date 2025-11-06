import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useRoomStore from "@/store/useRoomStore";
import useUserStore from "@/store/useUserStore";
import {
  ChevronDown,
  ChevronUp,
  HeadphoneOffIcon,
  RadioIcon,
} from "lucide-react-native";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

const NoBroadCastScreen = ({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { currentRoom } = useRoomStore();
  const { currentUser } = useUserStore();

  return (
    <View
      className="  gap-4 items-center justify-center"
      style={{
        flexDirection: expanded ? "column" : "row",
        justifyContent: expanded ? "center" : "space-between",
      }}
    >
      <HeadphoneOffIcon
        size={expanded ? 36 : 24}
        color={colors.textMuted}
        className="p-4 rounded-full "
        style={{ backgroundColor: colors.component }}
      />
      <View>
        <View className="flex flex-col gap-2">
          <View>
            <View>
              <Text
                className="text-lg font-semibold text-center"
                style={{ color: colors.text }}
              >
                No Active Broadcast
              </Text>
            </View>
            {expanded && (
              <View>
                <Text
                  className="text-base font-normal text-center"
                  style={{ color: colors.textMuted }}
                >
                  The host is not broadcasting at the moment. Please check back
                  later.
                </Text>
                {currentRoom?.admin === currentUser?._id && (
                  <Button
                    variant="solid"
                    action="primary"
                    size="sm"
                    style={{
                      marginTop: 16,
                      backgroundColor: colors.primary,
                      borderRadius: borderRadius.lg,
                    }}
                  >
                    <ButtonIcon as={RadioIcon} size="lg" />
                    <ButtonText>Start Broadcast</ButtonText>
                  </Button>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
      <Button
        onPress={() => setExpanded(!expanded)}
        size="sm"
        variant="link"
        className="float-right ml-auto"
      >
        <ButtonIcon as={expanded ? ChevronUp : ChevronDown} size="xl" />
      </Button>
    </View>
  );
};

export default NoBroadCastScreen;
