import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import useRoomStore from "@/store/useRoomStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ImagePlusIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {};

const index = (props: Props) => {
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const [visability, setVisability] = useState("public");
  const [imageFile, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [roomName, setRoomName] = useState<string>("");

  const { createRoom, isLoading } = useRoomStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!roomName || !visability || !imageFile) {
      return ToastAndroid.show(
        "Please provide all details",
        ToastAndroid.SHORT
      );
    }

    const success = await createRoom(roomName, visability, imageFile as any);
    console.log("success: ", success);
    if (success) {
      router.back();
      setRoomName("");
      setImage(undefined);
      setVisability("public");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: screenPadding.horizontal,
            marginTop: top + 20,
          }}
        >
          <View style={{ gap: 10, alignItems: "center", flex: 1 }}>
            {/* Uplode room image */}
            <TouchableOpacity
              style={{
                borderRadius: borderRadius.md,
                backgroundColor: !imageFile
                  ? colors.secondaryBackground
                  : "transparent",
                width: 200,
                height: 200,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPressIn={pickImage}
            >
              {!imageFile ? (
                <ImagePlusIcon size={48} color={colors.icon} />
              ) : (
                <Image
                  style={{
                    width: 200,
                    aspectRatio: 1,
                    borderRadius: borderRadius.md,
                  }}
                  source={{ uri: imageFile.uri }}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                marginTop: 40,
                width: "100%",
                paddingHorizontal: screenPadding.horizontal,
                justifyContent: "space-between",
              }}
              className="flex-1"
            >
              {/* Room name */}
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Room Name</FormControlLabelText>
                </FormControlLabel>
                <Input
                  size="xl"
                  style={{
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.secondaryBackground,
                    borderWidth: 0,
                    marginTop: 5,
                  }}
                >
                  <InputField
                    onChangeText={setRoomName}
                    placeholder="Enter room name"
                  />
                </Input>

                {/* Room visability*/}
                <View style={{ marginTop: 40 }}>
                  <FormControlLabel>
                    <FormControlLabelText>Visablity</FormControlLabelText>
                  </FormControlLabel>
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: colors.secondaryBackground,
                      borderRadius: borderRadius.md,
                      height: 50,
                      flexDirection: "row",
                      marginTop: 5,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor:
                          visability === "public"
                            ? colors.primary
                            : "transparent",
                        borderRadius: borderRadius.md,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 4,
                      }}
                      onPressIn={() => setVisability("public")}
                    >
                      <ThemedText type="default"> Public</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor:
                          visability === "private"
                            ? colors.primary
                            : "transparent",
                        borderRadius: borderRadius.md,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 2,
                      }}
                      onPressIn={() => setVisability("private")}
                    >
                      <ThemedText type="default">Private</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </FormControl>
              <Button
                style={{
                  marginBottom: bottom + 20,
                  borderRadius: borderRadius.lg,
                  backgroundColor: colors.primary,
                }}
                className="disabled:opacity-50"
                variant="solid"
                action="primary"
                size="xl"
                onPress={handleSubmit}
                disabled={!roomName || !visability || isLoading}
              >
                <ButtonText style={{ color: colors.text }}>
                  {isLoading ? "Creating..." : "Create Room"}
                </ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default index;
