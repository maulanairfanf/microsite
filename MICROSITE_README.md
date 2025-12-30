# Microsite

A responsive, mobile-first microsite built with Next.js and Tailwind CSS.

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # Main page that renders components
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── Hero.tsx              # Hero banner component
│   ├── Linktree.tsx          # Link tree component
│   ├── ProductCatalog.tsx    # Product grid component
│   └── ComponentRenderer.tsx # Router for different component types
├── types/            # TypeScript types
│   └── components.ts # Component interfaces
└── data/             # Static data
    └── components.json # Components configuration
```

## Components

### Hero
Full-screen hero banner with background image, title, subtitle, and CTA button.

### Linktree
Grid of clickable link cards - perfect for redirecting to multiple destinations.

### Product Catalog
Responsive product grid with images, titles, and pricing.

## Data Format

Each component object requires:
- `id`: Unique identifier (uuid)
- `type`: Component type (hero | linktree | product_catalog)
- `title`: Component title
- Additional fields depend on component type

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

The site is mobile-first responsive and will adapt to all screen sizes.
