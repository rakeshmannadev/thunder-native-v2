import { unknownArtistUri } from "@/constants/images";

export const resolveImage = (img: any) => {
  if (!img) return unknownArtistUri;
  if (typeof img === "string") return img;
  if (Array.isArray(img) && img.length > 0) {
    const last = img[img.length - 1];
    if (typeof last === "string") return last;
    if (last && typeof last === "object" && last.link) return last.link;
  }
  return unknownArtistUri;
};
