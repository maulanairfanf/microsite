export const PRODUCTS_CATALOG_SCHEMA = JSON.stringify([
  { name: "title", label: "Title", type: "text", placeholder: "Menu Lengkap" },
  {
    name: "categories",
    label: "Categories",
    type: "array",
    itemFields: [
      { name: "name", label: "Category Name", type: "text", placeholder: "Espresso" },
      {
        name: "products",
        label: "Products",
        type: "array",
        itemFields: [
          { name: "title", label: "Product Name", type: "text", placeholder: "Single Shot Espresso" },
          { name: "image", label: "Image", type: "file" },
          { name: "originalPrice", label: "Price", type: "number", placeholder: "50000" },
          { name: "discount", label: "Discount (%)", type: "text", placeholder: "18" },
          { name: "price", label: "Final Price", type: "number" },
          { name: "url", label: "Product URL", type: "text", placeholder: "https://..." },
        ],
      },
    ],
  },
]);
