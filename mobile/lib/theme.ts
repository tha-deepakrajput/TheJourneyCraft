export const Colors = {
  light: {
    background: "#ffffff",
    foreground: "#09090b",
    card: "#ffffff",
    cardForeground: "#09090b",
    primary: "#18181b",
    primaryForeground: "#fafafa",
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    border: "#e4e4e7",
    // Accent colors matching the web app
    orange: "#f97316",
    amber: "#f59e0b",
    blue: "#3b82f6",
    indigo: "#6366f1",
    emerald: "#10b981",
    teal: "#14b8a6",
    purple: "#a855f7",
    red: "#ef4444",
  },
  dark: {
    background: "#09090b",
    foreground: "#fafafa",
    card: "#09090b",
    cardForeground: "#fafafa",
    primary: "#fafafa",
    primaryForeground: "#18181b",
    muted: "#27272a",
    mutedForeground: "#a1a1aa",
    border: "#27272a",
    // Accent colors
    orange: "#f97316",
    amber: "#f59e0b",
    blue: "#3b82f6",
    indigo: "#6366f1",
    emerald: "#10b981",
    teal: "#14b8a6",
    purple: "#a855f7",
    red: "#ef4444",
  },
};

export type ColorScheme = keyof typeof Colors;
