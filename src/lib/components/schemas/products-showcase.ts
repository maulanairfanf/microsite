export const PRODUCTS_SHOWCASE_SCHEMA = JSON.stringify([
  { name: "title", label: "Title", type: "text", placeholder: "Menu Favorit" },
  {
    name: "items",
    label: "Products",
    type: "array",
    itemFields: [
      { name: "title", label: "Product Name", type: "text", placeholder: "Arabica Single Origin" },
      { name: "image", label: "Image", type: "file" },
      { name: "originalPrice", label: "Price", type: "number", placeholder: "50000" },
      { name: "discount", label: "Discount (%)", type: "text", placeholder: "18" },
      { name: "price", label: "Final Price", type: "number" },
      { name: "url", label: "Product URL", type: "text", placeholder: "https://..." },
    ],
  },
]);
