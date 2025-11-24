import { ToastAndroid } from "react-native";

const useToastMessage = () => {
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  return { showToast };
};

export default useToastMessage;
