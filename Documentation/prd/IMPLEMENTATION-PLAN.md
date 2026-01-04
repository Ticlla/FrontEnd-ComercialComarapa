# Frontend Implementation Plan

**Project:** Comercial Comarapa - Product Search Interface  
**Version:** 1.2  
**Date:** January 3, 2026  
**Last Updated:** January 3, 2026  

---

## Progress Tracker

| Milestone | Status | Completion |
|-----------|--------|------------|
| M1: Project Configuration | ✅ Complete | 100% |
| M2: API Layer | ✅ Complete | 100% |
| M3: Custom Hooks | ✅ Complete | 100% |
| M4: Search Components | ✅ Complete | 100% |
| M5: Search Page | ✅ Complete | 100% |
| M6: Styling & Polish | ✅ Complete | 100% |
| M7: Testing & Integration | ✅ Complete | 100% |
| **M8: Product Detail Modal** | ⏳ Pending | 0% |

**Phase 1 Progress:** 7/7 milestones ✅ Complete  
**Phase 2 Progress:** 0/1 milestones (0%)

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
  unit_price: string;      // PostgreSQL decimal → string
  cost_price: string | null;  // PostgreSQL decimal → string
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

### M7: Testing & Integration ✅
| Task | Description | Status |
|------|-------------|--------|
| M7.1 | Test with backend running | ✅ |
| M7.2 | Test responsive behavior | ✅ |
| M7.3 | Test edge cases (empty search, no results, errors) | ✅ |
| M7.4 | Performance check (debounce working) | ✅ |
| M7.5 | Unit tests (44 tests passing) | ✅ |

---

### M8: Product Detail Modal (Est: 4-5 hours) ⏳

**User Story:**
> As a store clerk, I want to click on a search result to see full product details so I can verify pricing and stock before assisting a customer.

| Task | File | Description |
|------|------|-------------|
| M8.1 | `src/components/ui/Modal.tsx` | Reusable modal with backdrop, ESC key close |
| M8.2 | `src/hooks/useModal.ts` | Hook for modal open/close state |
| M8.3 | `src/hooks/useProduct.ts` | React Query hook for single product fetch |
| M8.4 | `src/components/product/ProductDetailModal.tsx` | Main product detail modal |
| M8.5 | `src/components/product/ProductInfo.tsx` | SKU, category, description display |
| M8.6 | `src/components/product/ProductPricing.tsx` | Unit price, cost price, margin |
| M8.7 | `src/components/product/ProductStock.tsx` | Stock level with status indicator |
| M8.8 | `src/components/product/index.ts` | Barrel exports |
| M8.9 | Update `SearchBar.tsx` | Replace alert with modal open |
| M8.10 | Update `SearchPage.tsx` | Add modal state and render |

**Modal Component Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
```

**useProduct Hook:**
```typescript
function useProduct(productId: string | null) {
  return {
    data: Product | undefined,
    isLoading: boolean,
    isError: boolean,
    error: Error | null
  }
}
```

**Component Hierarchy:**
```
ProductDetailModal
├── Modal
│   ├── ModalHeader (Product Name + Close Button)
│   └── ModalBody
│       ├── ProductInfo (SKU, Category, Description)
│       ├── ProductPricing (Unit Price, Cost, Margin %)
│       └── ProductStock (Stock Level, Min Level, Status)
```

**Modal Layout:**
```
┌─────────────────────────────────────────────┐
│  Product Name                           [X] │
├─────────────────────────────────────────────┤
│                                             │
│  SKU: ARR-001        Category: Alimentos    │
│                                             │
│  Description text goes here if available... │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│       Bs. 25.00                             │
│       Unit Price                            │
│                                             │
│  Cost: Bs. 18.00         Margin: 28%        │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Stock: 45 units         ● In Stock         │
│  Min Level: 10                              │
│                                             │
└─────────────────────────────────────────────┘
```

**Stock Status Colors:**
| Status | Color | Message |
|--------|-------|---------|
| In Stock | 🟢 Green | "In Stock" |
| Low Stock | 🟡 Yellow | "Low Stock - Reorder Soon" |
| Out of Stock | 🔴 Red | "Out of Stock" |

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
│   ├── product/                    # NEW (M8)
│   │   ├── ProductDetailModal.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── ProductPricing.tsx
│   │   ├── ProductStock.tsx
│   │   └── index.ts
│   └── ui/
│       ├── Logo.tsx
│       └── Modal.tsx               # NEW (M8)
├── hooks/
│   ├── useProductSearch.ts
│   ├── useDebounce.ts
│   ├── useProduct.ts               # NEW (M8)
│   └── useModal.ts                 # NEW (M8)
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

### Phase 1 (Search) ✅
- [x] Search returns results in < 300ms
- [x] Debounce prevents excessive API calls
- [x] Stock indicators show correct colors
- [x] Responsive on mobile/tablet/desktop
- [x] Keyboard: Escape closes results
- [x] Error states handled gracefully
- [x] Loading spinner shows during fetch

### Phase 2 (Product Modal) ⏳
- [ ] Modal opens when clicking search result
- [ ] Modal displays all product information
- [ ] ESC key closes modal
- [ ] Click outside closes modal
- [ ] Loading state while fetching product
- [ ] Error state if product fetch fails
- [ ] Profit margin calculated correctly
- [ ] Stock status colors match design
- [ ] Responsive on mobile/tablet/desktop
- [ ] Unit tests for new components

---

## Future Phases (Out of Scope)

- Category filters
- Price range filters
- Search history
- Barcode scanning
- Inventory management (add/edit stock)
- User authentication

