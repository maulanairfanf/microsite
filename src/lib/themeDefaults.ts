import { Theme, ThemeTokens } from "@/types/components";

export const defaultTokens: ThemeTokens = {
  page: {
    background: "#e5e7eb",
    text: "#111827",
    headerText: "#111827",
  },
  container: {
    background: "#f3f4f6",
    backgroundOpacity: 1,
    radius: "16px",
    border: "0",
    shadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
  card: {
    background: "#ffffff",
    hoverBackground: "#f3f4f6",
    text: "#111827",
    border: "0",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    radius: "8px",
  },
};

export const defaultTheme: Theme = {
  id: "clean-gray",
  name: "Clean Gray",
  fontFamily: "Inter",
  theme: defaultTokens,
};
