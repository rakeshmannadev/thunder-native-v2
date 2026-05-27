const tintColorLight = "#059669"; // Sophisticated Emerald Teal
const tintColorDark = "#10b981"; // Vibrant Electric Emerald

export const Colors = {
  light: {
    primary: "#059669", // Emerald primary accent
    secondary: "#4f46e5", // Royal indigo
    accent: "#0891b2", // Soft cyan for highlights/visualizers
    text: "#0f172a", // Dark slate text
    textMuted: "#64748b", // Muted slate gray
    background: "#f8fafc", // Extremely clean light-slate backdrop
    secondaryBackground: "#f1f5f9", // Sightly darker container card color
    card: "#ffffff", // Elevated card color
    component: "#e2e8f0", // General components background
    borderColor: "#e2e8f0", // Subtle gray borders
    tint: tintColorLight,
    icon: "#475569",
    iconBackground: "rgba(128,128,128,0.1)",
    tabIconDefault: "#94a3b8",
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: "#10b981", // Brilliant electric emerald
    secondary: "#6366f1", // Modern bright indigo
    accent: "#06b6d4", // High-tech cyan for visualizer bars
    text: "#f8fafc", // Crisp off-white text
    textMuted: "#94a3b8", // Soft blue-gray for metadata/subtitles
    background: "#090d16", // Deep rich midnight space-blue (feels way more premium than #121212)
    secondaryBackground: "#131b2e", // Deep card/panel base
    card: "#1e293b", // Lighter contrast panel
    component: "#1e293b", // Element background
    borderColor: "#1e293b", // Sleek low-contrast separation borders
    tint: tintColorDark,
    icon: "#94a3b8",
    iconBackground: "rgba(128,128,128,0.1)",
    tabIconDefault: "#64748b",
    tabIconSelected: tintColorDark,
  },
};
