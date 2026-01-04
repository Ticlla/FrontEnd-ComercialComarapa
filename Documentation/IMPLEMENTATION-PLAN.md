# Frontend Implementation Plan - Phase 1

**Project:** Comercial Comarapa - Product Search Interface  
**Version:** 1.0  
**Date:** January 3, 2026  

---

## Overview

Implement a Google-like product search interface as defined in PRD-001.

### Tech Stack
- **React 19** + TypeScript
- **Vite 7** (build tool)
- **Tailwind CSS 4** (styling)
- **TanStack Query** (data fetching)
- **Axios** (HTTP client)
- **Lucide React** (icons)

### Backend API Available
- `GET /api/v1/products/search?q={term}&limit={n}` - Search products
- `GET /api/v1/products` - List products with filters
- `GET /api/v1/products/{id}` - Get product by ID

---

## Milestones

### M1: Project Configuration ✅
- [x] Vite + React + TypeScript setup
- [x] Tailwind CSS 4 configuration
- [x] Dependencies installed (axios, react-query, lucide-react, react-router-dom)
- [x] Folder structure created

### M2: API Layer (Est: 1 hour)
| Task | File | Description |
|------|------|-------------|
| M2.1 | `src/lib/api.ts` | Axios instance with base URL, interceptors |
| M2.2 | `src/services/products.ts` | Product API functions (search, getById) |
| M2.3 | `src/types/product.ts` | TypeScript interfaces matching backend |
| M2.4 | `src/types/api.ts` | Generic API response types |

**API Response Types:**
```typescript
interface APIResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category_id: string | null;
  unit_price: number;
  cost_price: number | null;
  current_stock: number;
  min_stock_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: CategoryResponse | null;
}

interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
}
```

### M3: Custom Hooks (Est: 45 min)
| Task | File | Description |
|------|------|-------------|
| M3.1 | `src/hooks/useProductSearch.ts` | React Query hook for search with debounce |
| M3.2 | `src/hooks/useDebounce.ts` | Generic debounce hook |

**useProductSearch Interface:**
```typescript
function useProductSearch(term: string, options?: { limit?: number }) {
  return {
    data: ProductResponse[] | undefined,
    isLoading: boolean,
    isError: boolean,
    error: Error | null
  }
}
```

### M4: Search Components (Est: 2 hours)
| Task | File | Description |
|------|------|-------------|
| M4.1 | `src/components/search/SearchBar.tsx` | Main search input with icon, clear button |
| M4.2 | `src/components/search/SearchResults.tsx` | Results dropdown container |
| M4.3 | `src/components/search/SearchResultItem.tsx` | Individual product row |
| M4.4 | `src/components/search/StockIndicator.tsx` | Stock level badge (green/yellow/red) |
| M4.5 | `src/components/search/index.ts` | Barrel exports |

**Component Hierarchy:**
```
SearchPage
└── SearchContainer
    ├── Logo
    ├── SearchBar
    │   ├── SearchIcon
    │   ├── Input
    │   ├── LoadingSpinner (conditional)
    │   └── ClearButton (conditional)
    └── SearchResults (conditional)
        └── SearchResultItem (multiple)
            ├── ProductInfo
            │   ├── Name
            │   ├── SKU + Price
            │   └── Category
            └── StockIndicator
```

### M5: Search Page (Est: 1 hour)
| Task | File | Description |
|------|------|-------------|
| M5.1 | `src/pages/SearchPage.tsx` | Main page with centered layout |
| M5.2 | `src/components/ui/Logo.tsx` | Store logo/title component |
| M5.3 | Update `src/App.tsx` | Route setup |

### M6: Styling & Polish (Est: 1.5 hours)
| Task | Description |
|------|-------------|
| M6.1 | Google-like search bar styling |
| M6.2 | Results dropdown with shadows |
| M6.3 | Stock indicator colors |
| M6.4 | Responsive design (mobile/tablet/desktop) |
| M6.5 | Loading states |
| M6.6 | Empty/error states |
| M6.7 | Keyboard navigation (Escape to close) |

### M7: Testing & Integration (Est: 1 hour)
| Task | Description |
|------|-------------|
| M7.1 | Test with backend running |
| M7.2 | Test responsive behavior |
| M7.3 | Test edge cases (empty search, no results, errors) |
| M7.4 | Performance check (debounce working) |

---

## File Structure (Final)

```
src/
├── components/
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   ├── SearchResultItem.tsx
│   │   ├── StockIndicator.tsx
│   │   └── index.ts
│   └── ui/
│       └── Logo.tsx
├── hooks/
│   ├── useProductSearch.ts
│   └── useDebounce.ts
├── lib/
│   └── api.ts
├── pages/
│   └── SearchPage.tsx
├── services/
│   └── products.ts
├── types/
│   ├── api.ts
│   └── product.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

---

## Design Tokens (Tailwind)

```css
/* To add in index.css or tailwind config */
:root {
  /* Primary */
  --color-primary: #1a73e8;
  --color-primary-hover: #1557b0;
  
  /* Status */
  --color-success: #188038;
  --color-warning: #f9ab00;
  --color-danger: #d93025;
  
  /* Neutral */
  --color-bg: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-text: #202124;
  --color-text-secondary: #5f6368;
  --color-border: #dfe1e5;
}
```

---

## Implementation Order

```
M2.3 → M2.4 → M2.1 → M2.2 → M3.2 → M3.1 → M4.4 → M4.3 → M4.2 → M4.1 → M5.2 → M5.1 → M5.3 → M6.* → M7.*
 ↓       ↓       ↓       ↓       ↓       ↓       ↓       ↓       ↓       ↓       ↓       ↓       ↓
Types → API  → Axios → Service → Debounce → Hook → Stock → Item → Results → Bar → Logo → Page → App → Polish → Test
```

**Estimated Total Time:** ~7 hours

---

## Dependencies Check

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.16",  ✅
    "axios": "^1.13.2",                    ✅
    "lucide-react": "^0.562.0",            ✅
    "react": "^19.2.0",                    ✅
    "react-dom": "^19.2.0",                ✅
    "react-router-dom": "^7.11.0"          ✅
  }
}
```

---

## Quick Start Commands

```bash
# Start backend (in BackEnd-CC folder)
cd ../BackEnd-CC
hatch run dev:start

# Start frontend (in FrontEnd-CC folder)
npm run dev

# Open browser
http://localhost:3000
```

---

## Success Criteria

- [ ] Search returns results in < 300ms
- [ ] Debounce prevents excessive API calls
- [ ] Stock indicators show correct colors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard: Escape closes results
- [ ] Error states handled gracefully
- [ ] Loading spinner shows during fetch

---

## Next Phase (Out of Scope)

- Product detail modal/page
- Category filters
- Price range filters
- Search history
- Barcode scanning


