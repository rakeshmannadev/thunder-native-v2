import { Colors } from "@/constants/Colors";
import useSongOperations from "@/hooks/useSongOperations";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera, Plus, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ThemedText";

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreatePlaylistModal = ({
  visible,
  onClose,
}: CreatePlaylistModalProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { bottom } = useSafeAreaInsets();
  const { createPlaylistMutation } = useSongOperations();

  const [playlistName, setPlaylistName] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
        // Reset form
        setPlaylistName("");
        setImage(null);
      }
    },
    [onClose]
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
      />
    ),
    []
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!playlistName.trim()) return;

    try {
      await createPlaylistMutation.mutateAsync({
        name: playlistName,
        image: image || undefined,
      });
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      // Error handled in mutation
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      enableDynamicSizing={true}
      snapPoints={["100%", "80%"]}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.component }}
      handleIndicatorStyle={{
        backgroundColor: colors.text,
        opacity: 0.2,
        width: 40,
      }}
    >
      <BottomSheetView
        style={[styles.contentContainer, { paddingBottom: bottom || 20 }]}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>Create New Playlist</ThemedText>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.dismiss()}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Image Picker */}
          <TouchableOpacity
            onPress={pickImage}
            style={[
              styles.imagePicker,
              { backgroundColor: colors.secondaryBackground },
            ]}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderIcon}>
                <Camera size={32} color={colors.textMuted} />
                <ThemedText
                  style={[styles.imageLabel, { color: colors.textMuted }]}
                >
                  Add Cover Photo
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Playlist Name</ThemedText>
            <TextInput
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholder="Enter playlist name"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.secondaryBackground,
                  borderColor: colors.borderColor,
                },
              ]}
              autoFocus={true}
            />
          </View>

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreate}
            disabled={!playlistName.trim() || createPlaylistMutation.isPending}
            style={[
              styles.createButton,
              {
                backgroundColor: colors.primary,
                opacity: playlistName.trim() ? 1 : 0.6,
              },
            ]}
          >
            {createPlaylistMutation.isPending ? (
              <Text style={styles.createButtonText}>Creating...</Text>
            ) : (
              <>
                <Plus size={20} color="white" strokeWidth={3} />
                <Text style={styles.createButtonText}>Create Playlist</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  form: {
    alignItems: "center",
    width: "100%",
  },
  imagePicker: {
    width: 160,
    height: 160,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(150, 150, 150, 0.3)",
  },
  placeholderIcon: {
    alignItems: "center",
    gap: 8,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 1,
  },
  createButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});

export default CreatePlaylistModal;
