export const HERO_SCHEMA = JSON.stringify([
  { name: "title", label: "Title", type: "text", placeholder: "Your page title" },
  { name: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Short tagline" },
  { name: "image", label: "Background Image", type: "file", aspectRatio: "21:9", width: 600 },
  { name: "logo", label: "Logo", type: "file", aspectRatio: "1:1", width: 200 },
  // {
  //   name: "cta",
  //   label: "Call to Action",
  //   type: "object",
  //   itemFields: [
  //     { name: "text", label: "Button Text", type: "text", placeholder: "Get Started" },
  //     { name: "url", label: "Button URL", type: "text", placeholder: "https://..." },
  //   ],
  // },
]);
