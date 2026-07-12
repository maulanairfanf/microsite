export const SOCIAL_MEDIA_SCHEMA = JSON.stringify([
  {
    name: "socialMedia",
    label: "Social Links",
    type: "array",
    itemFields: [
      { name: "name", label: "Platform Name", type: "text", placeholder: "Instagram" },
      { name: "url", label: "URL", type: "text", placeholder: "https://..." },
      { name: "icon", label: "Icon", type: "text", placeholder: "instagram" },
    ],
  },
  {
    name: "joinButton",
    label: "Join Button",
    type: "object",
    itemFields: [
      { name: "text", label: "Button Text", type: "text", placeholder: "Follow Us" },
      { name: "url", label: "Button URL", type: "text", placeholder: "https://..." },
    ],
  },
]);
