export const HERO_COMPONENT_NAME = "Hero";

export const HERO_CONFIG_SCHEMA = JSON.stringify([
  { name: "title", label: "Title", type: "text", placeholder: "Your page title" },
  {
    name: "subtitle",
    label: "Subtitle",
    type: "textarea",
    placeholder: "Short tagline",
  },
  {
    name: "image",
    label: "Background Image URL",
    type: "text",
    placeholder: "https://...",
  },
  { name: "logo", label: "Logo URL", type: "text", placeholder: "https://..." },
  {
    name: "cta",
    label: "Call to Action",
    type: "object",
    itemFields: [
      { name: "text", label: "Button Text", type: "text", placeholder: "Get Started" },
      { name: "url", label: "Button URL", type: "text", placeholder: "https://..." },
    ],
  },
]);
