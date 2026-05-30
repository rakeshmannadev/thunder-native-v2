import {
  DiscAlbumIcon,
  DownloadIcon,
  EditIcon,
  Headphones,
  ListMusicIcon,
  ListPlusIcon,
  ListVideoIcon,
  LogOutIcon,
  LucideCoffee,
  LucideIcon,
  Mic2Icon,
  MoonIcon,
  PlayIcon,
  Share2Icon,
  ShuffleIcon,
  SunIcon,
  TrashIcon,
  WifiOffIcon,
} from "lucide-react-native";
import { Image, ImageStyle } from "react-native";

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

export const ICON_MAPS: Record<string, LucideIcon> = {
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
  requests: ListMusicIcon,
  broadcast: Mic2Icon,
  logout: LogOutIcon,
  disconnect: WifiOffIcon,
  edit: EditIcon,
  play: PlayIcon,
  shuffle: ShuffleIcon,
};
