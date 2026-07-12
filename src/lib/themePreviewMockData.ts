import type { SectionWithComponent } from "@/lib/db/types";

function jsonStringify(obj: unknown): string {
  return JSON.stringify(obj);
}

const COFFEE = {
  espresso: [
    "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop",
  ],
  milk: [
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=500&auto=format&fit=crop",
  ],
  cold: [
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop",
  ],
  pastry: [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop",
  ],
  banner: [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop",
  ],
};

export const PREVIEW_SECTIONS: SectionWithComponent[] = [
  {
    id: "mock-hero",
    tenantId: "mock-tenant",
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    component: { id: "mock-hero-comp", name: "Hero", displayName: "Hero" },
    configJson: jsonStringify({
      title: "Kopi Tetangga",
      subtitle: "Single-origin beans, roasted weekly. Crafted by hand, served with heart ☕",
      image: "",
      logo: "",
      cta: { text: "Order Now", url: "#" },
    }),
  },
  {
    id: "mock-banner",
    tenantId: "mock-tenant",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    component: { id: "mock-banner-comp", name: "Banner", displayName: "Banner" },
    configJson: jsonStringify({
      title: "This Week's Specials",
      data: [
        {
          id: "bn-1",
          section_id: "promo-buy2",
          image_url: COFFEE.banner[0],
          cta: { text: "Buy 2 Get 1", url: "#" },
        },
        {
          id: "bn-2",
          section_id: "new-arrival",
          image_url: COFFEE.banner[1],
          cta: { text: "New Arrival", url: "#" },
        },
        {
          id: "bn-3",
          section_id: "loyalty",
          image_url: COFFEE.banner[2],
          cta: { text: "Members Only", url: "#" },
        },
      ],
    }),
  },
  {
    id: "mock-linktree",
    tenantId: "mock-tenant",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    component: { id: "mock-linktree-comp", name: "Linktree", displayName: "Linktree" },
    configJson: jsonStringify({
      title: "Quick Links",
      items: [
        { id: "lk-1", text: "Order via WhatsApp", url: "#", icon: "whatsapp" },
        { id: "lk-2", text: "Follow on Instagram", url: "#", icon: "instagram" },
        { id: "lk-3", text: "View on Google Maps", url: "#", icon: "menu" },
        { id: "lk-4", text: "Reserve a Table", url: "#", icon: "shopee" },
      ],
    }),
  },
  {
    id: "mock-showcase",
    tenantId: "mock-tenant",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    component: { id: "mock-showcase-comp", name: "Products Showcase", displayName: "Products Showcase" },
    configJson: jsonStringify({
      title: "Best Sellers",
      items: [
        {
          id: "sh-1",
          title: "House Blend Espresso",
          image: COFFEE.espresso[0],
          price: 28000,
          originalPrice: 35000,
          discount: "20%",
          url: "#",
        },
        {
          id: "sh-2",
          title: "Iced Caramel Latte",
          image: COFFEE.milk[0],
          price: 42000,
          url: "#",
        },
        {
          id: "sh-3",
          title: "Matcha Oat Latte",
          image: COFFEE.milk[1],
          price: 48000,
          url: "#",
        },
        {
          id: "sh-4",
          title: "Cold Brew Classic",
          image: COFFEE.cold[0],
          price: 38000,
          url: "#",
        },
        {
          id: "sh-5",
          title: "Almond Croissant",
          image: COFFEE.pastry[0],
          price: 32000,
          url: "#",
        },
      ],
    }),
  },
  {
    id: "mock-catalog",
    tenantId: "mock-tenant",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    component: { id: "mock-catalog-comp", name: "Products Catalog", displayName: "Products Catalog" },
    configJson: jsonStringify({
      title: "Full Menu",
      categories: [
        {
          id: "espresso",
          name: "Espresso",
          products: [
            {
              id: "cat-esp-1",
              title: "Single Shot",
              image: COFFEE.espresso[0],
              price: 22000,
              url: "#",
            },
            {
              id: "cat-esp-2",
              title: "Double Shot",
              image: COFFEE.espresso[1],
              price: 28000,
              url: "#",
            },
            {
              id: "cat-esp-3",
              title: "Macchiato",
              image: COFFEE.espresso[0],
              price: 30000,
              url: "#",
            },
            {
              id: "cat-esp-4",
              title: "Affogato",
              image: COFFEE.espresso[1],
              price: 38000,
              originalPrice: 45000,
              discount: "15%",
              url: "#",
            },
          ],
        },
        {
          id: "milk-coffee",
          name: "Milk Coffee",
          products: [
            {
              id: "cat-mc-1",
              title: "Cappuccino",
              image: COFFEE.milk[0],
              price: 36000,
              url: "#",
            },
            {
              id: "cat-mc-2",
              title: "Caffè Latte",
              image: COFFEE.milk[1],
              price: 38000,
              url: "#",
            },
            {
              id: "cat-mc-3",
              title: "Flat White",
              image: COFFEE.milk[0],
              price: 40000,
              url: "#",
            },
            {
              id: "cat-mc-4",
              title: "Mocha",
              image: COFFEE.milk[1],
              price: 42000,
              url: "#",
            },
          ],
        },
        {
          id: "cold-brew",
          name: "Cold Brew",
          products: [
            {
              id: "cat-cb-1",
              title: "Classic Cold Brew",
              image: COFFEE.cold[0],
              price: 35000,
              url: "#",
            },
            {
              id: "cat-cb-2",
              title: "Iced Americano",
              image: COFFEE.cold[1],
              price: 32000,
              url: "#",
            },
            {
              id: "cat-cb-3",
              title: "Iced Caramel Latte",
              image: COFFEE.cold[0],
              price: 42000,
              url: "#",
            },
            {
              id: "cat-cb-4",
              title: "Iced Matcha Latte",
              image: COFFEE.cold[1],
              price: 45000,
              originalPrice: 52000,
              discount: "13%",
              url: "#",
            },
          ],
        },
        {
          id: "pastries",
          name: "Pastries",
          products: [
            {
              id: "cat-ps-1",
              title: "Almond Croissant",
              image: COFFEE.pastry[0],
              price: 32000,
              url: "#",
            },
            {
              id: "cat-ps-2",
              title: "Chocolate Muffin",
              image: COFFEE.pastry[1],
              price: 25000,
              url: "#",
            },
            {
              id: "cat-ps-3",
              title: "Cinnamon Roll",
              image: COFFEE.pastry[0],
              price: 30000,
              url: "#",
            },
            {
              id: "cat-ps-4",
              title: "Banana Bread",
              image: COFFEE.pastry[1],
              price: 28000,
              url: "#",
            },
          ],
        },
      ],
    }),
  },
  {
    id: "mock-social",
    tenantId: "mock-tenant",
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    component: { id: "mock-social-comp", name: "Social Media", displayName: "Social Media" },
    configJson: jsonStringify({
      socialMedia: [
        { name: "Instagram", url: "#", icon: "instagram" },
        { name: "TikTok", url: "#", icon: "tiktok" },
        { name: "Facebook", url: "#", icon: "facebook" },
        { name: "YouTube", url: "#", icon: "youtube" },
        { name: "Spotify", url: "#", icon: "spotify" },
      ],
      joinButton: {
        text: "Follow @kopitetangga",
        url: "#",
      },
    }),
  },
  {
    id: "mock-footer",
    tenantId: "mock-tenant",
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    component: { id: "mock-footer-comp", name: "Footer", displayName: "Footer" },
    configJson: jsonStringify({
      socialMedia: [],
      joinButton: {
        text: "Join this page on Halamanku",
        url: "#",
      },
      footerLinks: [
        { text: "Cookie Preferences", url: "#" },
        { text: "Report", url: "#" },
        { text: "Privacy", url: "#" },
      ],
    }),
  },
];
