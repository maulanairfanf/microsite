# Theme System Documentation

## Struktur Theme

Setiap tenant memiliki file `theme.json` di folder tenant masing-masing:
```
src/data/tenants/[tenant-name]/theme.json
```

## Schema Theme

```json
{
  "name": "cleanGray",
  "fontFamily": "Inter",
  "colorScheme": "gray",
  "background": {
    "type": "solid",
    "color": "#f3f4f6"
  }
}
```

## Theme Presets

Sistem menggunakan preset-based theming. Saat ini tersedia 2 preset:

### cleanGray (Default - Gray & White)
- Background: Light gray (#f3f4f6)
- Container: White dengan subtle border & shadow
- Cards: White dengan minimal styling
- Font: Inter
- Border: Subtle gray
- Shadow: Minimal

### purplePink (Purple & Pink)
- Background: Deep purple (#7f2aeb)
- Container: Dark purple dengan black border & shadow
- Cards: Pink (#e058d6) dengan black border & shadow
- Font: Poppins
- Border: 2px solid black (bold)
- Shadow: Offset shadow (retro/brutalist style)

## Available Options

### Font Families
- Inter
- Poppins
- Roboto
- Open Sans
- Lato
- Montserrat
- Playfair Display (serif)
- Merriweather (serif)
- Oxanium

### Preset Names
- cleanGray (default)
- purplePink
- *Future: tambahkan preset custom via admin*

### Background Types

**Solid (current):**
```json
{
  "type": "solid",
  "color": "#f3f4f6"
}
```

**Image (future):**
```json
{
  "type": "image",
  "url": "/backgrounds/pattern.jpg",
  "blur": 8,
  "overlay": "rgba(0,0,0,0.3)"
}
```

## Contoh Theme JSON

### cleanGray (Default)
```json
{
  "name": "cleanGray",
  "fontFamily": "Inter",
  "colorScheme": "gray",
  "background": { "type": "solid", "color": "#f3f4f6" }
}
```

### purplePink
```json
{
  "name": "purplePink",
  "fontFamily": "Poppins",
  "colorScheme": "purple",
  "background": { "type": "solid", "color": "#7f2aeb" }
}
```

### Custom Background Override
```json
{
  "name": "cleanGray",
  "fontFamily": "Inter",
  "colorScheme": "gray",
  "background": { "type": "solid", "color": "#e0f2fe" }
}
```
*Note: `background.color` akan override `--pageBackground` dari preset*

## CSS Variables (Tokens)

Sistem theme menggunakan CSS Variables yang di-inject secara dinamis dan dibagi menjadi tiga kelompok token:

### Page Level Tokens
- `--pageBackground` - Background color untuk seluruh halaman
- `--profileBackground` - Alias untuk `--pageBackground` (backward compatibility)
- `--bodyText` - Warna teks body default
- `--headerTextColor` - Warna untuk judul/heading
- `--headerFontFamily` - Font family untuk header

### Container Tokens (Mobile Frame)
- `--containerBackground` - Background container utama
- `--containerRadius` - Border radius container
- `--containerBorder` - Border container (format: "2px solid #000000" atau "0")
- `--containerShadow` - Shadow container (format: "0 4px 0 #000000" atau "none")

### Card/Link/Button Tokens
- `--cardBackground` - Background untuk card/link/button
- `--cardHoverBackground` - Background saat hover
- `--cardText` - Warna teks dalam card/link/button
- `--cardBorder` - Border card (format: "2px solid #000000" atau "0")
- `--cardShadow` - Shadow card (format: "3px 4px 0 #000000" atau "none")
- `--cardRadius` - Border radius card

## Utility Classes

### Container Utilities
```css
.container-bg           /* background + border-radius */
.container-border       /* border */
.container-shadow       /* box-shadow */
```

### Card Utilities
```css
.card-bg               /* background + color + border-radius */
.card-hover-bg         /* hover background */
.card-border           /* border */
.card-shadow           /* box-shadow */
```

### Button Utilities
```css
.btn                   /* Complete button styling (sama dengan card) */
                       /* Includes: display, align, padding, font, 
                          background, color, border, shadow, radius, 
                          cursor, transition */
```

## Cara Pakai di Component

### Page Background
```tsx
// Background halaman penuh dengan body text
<main style={{ backgroundColor: 'var(--pageBackground)', color: 'var(--bodyText)' }}>
```

### Container (Mobile Frame)
```tsx
// Container utama dengan border & shadow optional
<div className="container-bg container-border container-shadow" 
     style={{ fontFamily: 'var(--headerFontFamily)' }}>
```

### Card/Link Items
```tsx
// Card dengan hover effect
<a className="card-bg card-hover-bg card-border card-shadow">
  <span style={{ color: 'var(--cardText)' }}>Link Text</span>
</a>
```

### Buttons
```tsx
// Button dengan styling lengkap (reuse card tokens)
<button className="btn card-border card-shadow">
  Click Me
</button>

// Atau button tanpa border/shadow
<button className="btn">
  Simple Button
</button>
```

### Headers & Text
```tsx
// Header dengan theme font
<h1 style={{ color: 'var(--headerTextColor)', fontFamily: 'var(--headerFontFamily)' }}>
  Title
</h1>

// Body text
<p style={{ color: 'var(--bodyText)' }}>Content</p>

// Card text
<span style={{ color: 'var(--cardText)' }}>Card content</span>
```

### Badges/Labels
```tsx
// Badge dengan inverted color (text color as bg, page bg as text)
<div style={{ 
  backgroundColor: 'var(--cardText)', 
  color: 'var(--pageBackground)' 
}}>
  50% OFF
</div>
```

## Design Principles

### Token Separation
- **Page**: Outer background dan body text (full page)
- **Container**: Mobile frame/wrapper (inner container)
- **Card**: Individual items (links, products, buttons)

### Optional Styling
- Border dan shadow bersifat **opt-in** via utility classes
- Tidak semua elemen harus punya border/shadow
- Preset menentukan default, tapi component bisa override

### Flexibility
- Preset menentukan base colors & styling
- `background.color` di theme.json bisa override page background
- Font family bisa diubah per tenant
- Border & shadow bisa di-mix (e.g., pink bg dengan blue border)

## Component Implementations

### Sudah Themed
- ✅ Page layout ([...tenant]/page.tsx)
- ✅ Hero component
- ✅ Linktree items
- ✅ ProductCard
- ✅ ProductsShowcase
- ✅ ProductsCatalog (tabs)
- ✅ Footer (CTA button)
- ✅ BottomSheet (modal)
- ✅ HorizontalScroll (nav buttons)
- ✅ Banner (title)
- ✅ SocialMedia icons

## Future Enhancements

1. ✅ Background image support (struktur sudah ready)
2. ✅ Button styling system (implementasi `.btn` utility)
3. ⏳ Admin UI untuk edit theme
4. ⏳ Theme preview mode
5. ⏳ Save theme preferences ke localStorage/cookies
6. ⏳ More presets (oceanBlue, warmOrange, modernPurple, etc.)
7. ⏳ Border radius customization per component
8. ⏳ Custom shadow presets
