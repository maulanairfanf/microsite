export const BANNER_SCHEMA = JSON.stringify([
  { name: "title", label: "Title", type: "text", placeholder: "Promo & Penawaran" },
  {
    name: "data",
    label: "Banner Items",
    type: "array",
    itemFields: [
      { name: "id", label: "ID", type: "text", placeholder: "banner-1" },
      { name: "section_id", label: "Section ID", type: "text", placeholder: "promo_coffee" },
      { name: "image_url", label: "Image", type: "file" },
      {
        name: "cta",
        label: "CTA",
        type: "object",
        itemFields: [
          { name: "text", label: "Button Text", type: "text", placeholder: "Buy 2 Get 1" },
          { name: "url", label: "Button URL", type: "text", placeholder: "https://..." },
        ],
      },
    ],
  },
]);
