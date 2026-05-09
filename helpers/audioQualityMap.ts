export const QUALITY_MAP = {
  low: "96kbps",
  medium: "160kbps",
  high: "320kbps",
} as const;

export type Quality = keyof typeof QUALITY_MAP;
