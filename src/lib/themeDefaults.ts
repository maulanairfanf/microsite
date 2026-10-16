import { Theme, ThemeTokens } from "@/types/components";

export const defaultTokens: ThemeTokens = {
  page: {
    background: "#F8F8F6",
    text: "#171717",
    headerText: "#171717",
  },
  container: {
    background: "#FFFFFF",
    backgroundOpacity: 1,
    radius: "16px",
    border: "1px solid #E8E8E5",
    shadow: "none",
  },
  card: {
    background: "#ffffff",
    hoverOpacity: 7,
    text: "#171717",
    border: "1px solid #E8E8E5",
    shadow: "none",
    radius: "12px",
  },
};

export const defaultTheme: Theme = {
  id: "clean-gray",
  name: "Clean Gray",
  fontFamily: "Inter",
  theme: defaultTokens,
};
