export const PRODUCTS_CATALOG_SCHEMA = JSON.stringify([
  { name: "title", label: "Title", type: "text", placeholder: "Menu Lengkap" },
  {
    name: "categories",
    label: "Categories",
    type: "array",
    itemFields: [
      { name: "id", label: "Category ID", type: "text", placeholder: "espresso" },
      { name: "name", label: "Category Name", type: "text", placeholder: "Espresso" },
      {
        name: "products",
        label: "Products",
        type: "array",
        itemFields: [
          { name: "id", label: "Product ID", type: "text", placeholder: "esp1" },
          { name: "title", label: "Product Name", type: "text", placeholder: "Single Shot Espresso" },
          { name: "image", label: "Image", type: "file" },
          { name: "price", label: "Price (IDR)", type: "number", placeholder: "25000" },
          { name: "url", label: "Product URL", type: "text", placeholder: "https://..." },
        ],
      },
    ],
  },
]);
