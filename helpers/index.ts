import { AudioPreferenceType, qualites } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const getAudioPreference = async (): Promise<
  AudioPreferenceType | undefined
> => {
  try {
    const value = await AsyncStorage.getItem("audio-preference");
    if (value) {
      const preference: AudioPreferenceType = JSON.parse(value);
      return preference;
    }
    return {
      downloadFirst: true,
      quality: qualites.medium,
    };
  } catch (err: any) {
    console.log(
      "Error while getting audio preference from localstorage: ",
      err.message
    );
  }
};
export const setAudioPreference = async (preference: AudioPreferenceType) => {
  try {
    await AsyncStorage.setItem("audio-preference", JSON.stringify(preference));
  } catch (err: any) {
    console.log(
      "Error while setting audio preference to localstorage: ",
      err.message
    );
  }
};
