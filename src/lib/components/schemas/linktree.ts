export const LINKTREE_SCHEMA = JSON.stringify([
  { name: "title", label: "Title", type: "text", placeholder: "Contact & Follow" },
  {
    name: "items",
    label: "Links",
    type: "array",
    itemFields: [
      { name: "text", label: "Link Text", type: "text", placeholder: "WhatsApp" },
      { name: "url", label: "URL", type: "text", placeholder: "https://..." },
      { name: "icon", label: "Icon", type: "text", placeholder: "whatsapp" },
    ],
  },
]);
