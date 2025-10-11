import { useNavigation, useRouter } from "expo-router";

const useMenuActions = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const handleMenuActions = (action: string, id?: number | any) => {
    switch (action) {
      case "go_to_artist":
        router.push({ pathname: "/artist/[id]", params: { id: id } });
      case "go_to_album":
        router.push({ pathname: "/album/[id]", params: { id: id } });
        break;
      default:
        break;
    }
  };

  return { handleMenuActions };
};

export default useMenuActions;
