export const PRODUCTS_SHOWCASE_SCHEMA = JSON.stringify([
  { name: "title", label: "Title", type: "text", placeholder: "Menu Favorit" },
  {
    name: "items",
    label: "Products",
    type: "array",
    itemFields: [
      { name: "id", label: "ID", type: "text", placeholder: "prod-1" },
      { name: "title", label: "Product Name", type: "text", placeholder: "Arabica Single Origin" },
      { name: "image", label: "Image URL", type: "text", placeholder: "https://..." },
      { name: "price", label: "Price (IDR)", type: "number", placeholder: "45000" },
      { name: "originalPrice", label: "Original Price (IDR)", type: "number", placeholder: "55000" },
      { name: "discount", label: "Discount", type: "text", placeholder: "18%" },
      { name: "url", label: "Product URL", type: "text", placeholder: "https://..." },
    ],
  },
]);
