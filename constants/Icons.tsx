import {
  DiscAlbumIcon,
  DownloadIcon,
  Headphones,
  ListMusicIcon,
  ListPlusIcon,
  ListVideoIcon,
  LucideCoffee,
  Mic2Icon,
  MoonIcon,
  Share2Icon,
  SunIcon,
  TrashIcon,
} from "lucide-react-native";
import { Image, ImageStyle } from "react-native";

export const HomeIcon = ({ color }: { color: any }) => {
  return (
    <Image source={require("../assets/icons/home.svg")} tintColor={color} />
  );
};

export const AlbumIcon = ({ color }: { color: any }) => {
  return (
    <Image source={require("../assets/icons/library.svg")} tintColor={color} />
  );
};
export const RoomsIcon = ({ color }: { color: any }) => {
  return (
    <Image source={require("../assets/icons/rooms.svg")} tintColor={color} />
  );
};
export const PersonIcon = ({ color }: { color: any }) => {
  return (
    <Image source={require("../assets/icons/person.svg")} tintColor={color} />
  );
};
export const LogoIcon = ({ styles }: { styles?: ImageStyle }) => {
  return (
    <Image
      source={require("../assets/images/Thunder_logo.png")}
      style={{
        width: 38,
        aspectRatio: 1,
        marginLeft: 10,
        marginTop: 12,
        marginRight: 5,
        ...styles,
      }}
    />
  );
};

export const ICON_MAPS: Record<string, any> = {
  album: DiscAlbumIcon,
  artist: Mic2Icon,
  playlist: ListPlusIcon,
  queue: ListMusicIcon,
  share: Share2Icon,
  delete: TrashIcon,
  download: DownloadIcon,
  play_next: ListVideoIcon,
  sun: SunIcon,
  moon: MoonIcon,
  mug: LucideCoffee,
  headphones: Headphones,
};
