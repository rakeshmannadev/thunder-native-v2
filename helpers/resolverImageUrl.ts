import { unknownArtistUri, unknownTrackUri } from "@/constants/images";

export const resolveImage = (img: any, type = "track") => {
  if (!img) return type === "track" ? unknownTrackUri : unknownArtistUri;
  if (typeof img === "string") return img;
  if (Array.isArray(img) && img.length > 0) {
    const last = img[img.length - 1];
    if (typeof last === "string") return last;
    if (last && typeof last === "object" && last.link) return last.link;
  }
  return type === "track" ? unknownTrackUri : unknownArtistUri;
};

export const resolveImageSource = (img: any, type: string) => {
  const resolved = resolveImage(img, type);
  if (
    typeof resolved === "string" &&
    (resolved.startsWith("http") ||
      resolved.startsWith("file://") ||
      resolved.startsWith("data:"))
  ) {
    return { uri: resolved };
  }
  return resolved;
};
