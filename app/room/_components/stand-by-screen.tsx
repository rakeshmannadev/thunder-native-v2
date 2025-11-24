import { Button, ButtonIcon } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { ChevronDown, ChevronUp, HeadphonesIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Text, useColorScheme, View } from "react-native";

const StandByScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      className="gap-4 items-center justify-center"
      style={{
        flexDirection: expanded ? "column" : "row",
        justifyContent: expanded ? "center" : "space-between",
      }}
    >
      <HeadphonesIcon
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
                Please Standby
              </Text>
            </View>
            {expanded && (
              <View>
                <Text
                  className="text-base font-normal text-center"
                  style={{ color: colors.textMuted }}
                >
                  The host is about to start broadcast.
                </Text>
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

export default StandByScreen;
