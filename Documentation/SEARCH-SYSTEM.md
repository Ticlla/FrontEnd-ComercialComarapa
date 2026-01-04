# Search System Architecture

This document explains how the product search system works in the Comercial Comarapa frontend.

## Overview

The search system provides a Google-like search experience for finding products by name or SKU. It features debounced searching, caching, keyboard navigation, and a modal for viewing product details.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SearchPage                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                           SearchBar                                  │    │
│  │  ┌──────────────┐    ┌───────────────────┐    ┌─────────────────┐   │    │
│  │  │ Input Field  │───►│ useProductSearch  │───►│  SearchResults  │   │    │
│  │  │ (searchTerm) │    │                   │    │                 │   │    │
│  │  └──────────────┘    │ ┌───────────────┐ │    │ ┌─────────────┐ │   │    │
│  │                      │ │  useDebounce  │ │    │ │SearchResult │ │   │    │
│  │                      │ │   (300ms)     │ │    │ │    Item     │ │   │    │
│  │                      │ └───────┬───────┘ │    │ └─────────────┘ │   │    │
│  │                      │         │         │    └─────────────────┘   │    │
│  │                      │         ▼         │                          │    │
│  │                      │ ┌───────────────┐ │                          │    │
│  │                      │ │  React Query  │ │                          │    │
│  │                      │ │   (cache)     │ │                          │    │
│  │                      │ └───────┬───────┘ │                          │    │
│  │                      └─────────┼─────────┘                          │    │
│  └────────────────────────────────┼────────────────────────────────────┘    │
│                                   │                                          │
│                                   ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        products.ts (Service)                         │    │
│  │                     searchProducts({ q, limit })                     │    │
│  └─────────────────────────────────┬───────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          api.ts (Axios)                              │    │
│  │                   GET /api/v1/products/search                        │    │
│  └─────────────────────────────────┬───────────────────────────────────┘    │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
                          ┌────────────────────┐
                          │   Backend API      │
                          │  FastAPI Server    │
                          │  (localhost:8000)  │
                          └────────────────────┘
```

## Data Flow

### 1. User Types in Search Bar

```
User types "ace" → SearchBar.handleInputChange() → setSearchTerm("ace")
```

**File:** `src/components/search/SearchBar.tsx`

```typescript
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchTerm(value);        // Update local state immediately
  
  if (value.trim()) {
    setIsOpen(true);           // Open dropdown immediately
    setSelectedIndex(-1);      // Reset keyboard selection
  } else {
    setIsOpen(false);
  }
};
```

### 2. Debouncing (300ms delay)

The raw search term is debounced to avoid API calls on every keystroke.

**File:** `src/hooks/useDebounce.ts`

```typescript
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);   // Update after delay
    }, delay);

    return () => clearTimeout(timer);  // Cancel if value changes
  }, [value, delay]);

  return debouncedValue;
}
```

**Timeline:**
```
Time:   0ms     100ms    200ms    300ms    400ms
User:   "a"     "ac"     "ace"    
Debounced:                        "ace" ← API call triggered here
```

### 3. useProductSearch Hook

Orchestrates debouncing, API calls, and caching.

**File:** `src/hooks/useProductSearch.ts`

```typescript
export function useProductSearch(
  searchTerm: string,
  options: UseProductSearchOptions = {}
): UseProductSearchResult {
  const {
    limit = 10,           // Max results
    debounceMs = 300,     // Debounce delay
    minChars = 1,         // Minimum characters to search
    enabled = true,
  } = options;

  // Step 1: Debounce the search term
  const debouncedRawTerm = useDebounce(searchTerm, debounceMs);
  const debouncedTerm = debouncedRawTerm.trim();

  // Step 2: Check if we should search
  const shouldSearch = enabled && debouncedTerm.length >= minChars;

  // Step 3: React Query handles the API call and caching
  const query = useQuery({
    queryKey: ['products', 'search', debouncedTerm, limit],
    queryFn: () => searchProducts({ q: debouncedTerm, limit }),
    enabled: shouldSearch,
    staleTime: 1000 * 60,      // 1 minute
    gcTime: 1000 * 60 * 5,     // 5 minutes cache
  });

  return {
    data: query.data ?? [],
    isLoading: shouldSearch && query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    debouncedTerm,
  };
}
```

### 4. API Service Layer

Makes the HTTP request to the backend.

**File:** `src/services/products.ts`

```typescript
export async function searchProducts(params: SearchProductsParams): Promise<Product[]> {
  const { q, limit = 10 } = params;
  
  // Skip API call for empty search
  if (!q || !q.trim()) {
    return [];
  }
  
  const response = await api.get<APIResponse<Product[]>>('/products/search', {
    params: { q, limit },
  });
  
  return response.data.data;
}
```

### 5. Axios Instance

Configured with base URL, timeout, and interceptors.

**File:** `src/lib/api.ts`

```typescript
export const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',         // Proxied to backend
  timeout: 10000,             // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 6. Vite Proxy

Routes `/api` requests to the backend server.

**File:** `vite.config.ts`

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',  // Backend
      changeOrigin: true,
    },
  },
},
```

### 7. Backend Response

```http
GET /api/v1/products/search?q=ace&limit=10

Response:
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Aceite de Oliva",
      "sku": "ACE-001",
      "unit_price": "45.50",      // String (PostgreSQL decimal)
      "cost_price": "35.00",
      "current_stock": 25,
      "min_stock_level": 10,
      "is_active": true,
      "category": {
        "id": "uuid-cat",
        "name": "Aceites"
      }
    }
  ],
  "success": true
}
```

## Component Hierarchy

```
SearchPage
├── Logo
├── SearchBar
│   ├── Input (controlled)
│   ├── Search Icon
│   ├── Loader2 (spinner when fetching)
│   ├── Clear Button (X)
│   └── SearchResults (dropdown)
│       └── SearchResultItem[] (each product row)
│           ├── Package Icon
│           ├── Product Name
│           ├── SKU | Price | Category
│           └── StockIndicator
└── ProductDetailModal (opens on product click)
```

## State Management

### SearchBar State

| State | Type | Purpose |
|-------|------|---------|
| `searchTerm` | `string` | Raw input value |
| `isOpen` | `boolean` | Dropdown visibility |
| `selectedIndex` | `number` | Keyboard navigation index (-1 = none) |

### useProductSearch State (from React Query)

| State | Type | Purpose |
|-------|------|---------|
| `data` | `Product[]` | Search results |
| `isLoading` | `boolean` | Initial load state |
| `isFetching` | `boolean` | Any fetch in progress |
| `isError` | `boolean` | Error occurred |
| `debouncedTerm` | `string` | Current debounced term |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` ArrowDown | Select next item |
| `↑` ArrowUp | Select previous item |
| `Enter` | Open selected product modal |
| `Escape` | Close dropdown / Clear search |

## Caching Strategy

React Query handles caching with these settings:

```typescript
{
  queryKey: ['products', 'search', debouncedTerm, limit],
  staleTime: 1000 * 60,      // Data is fresh for 1 minute
  gcTime: 1000 * 60 * 5,     // Cache kept for 5 minutes
}
```

**Benefits:**
- Same search term doesn't trigger new API call if cached
- Background refetch when data is stale
- Automatic garbage collection of old cache entries

## Error Handling

### Network Errors
```typescript
// src/lib/api.ts
if (axiosError.code === 'ERR_NETWORK') {
  return 'Error de conexión. Verifica tu conexión a internet.';
}
```

### UI Error State
```tsx
// SearchResults.tsx
{isError && !isLoading && (
  <div className="text-[var(--color-danger)]">
    <SearchX size={32} />
    <span>Error al buscar. Intenta de nuevo.</span>
  </div>
)}
```

## Price Formatting

Backend returns prices as strings (PostgreSQL decimal). Frontend converts:

```typescript
// src/lib/formatters.ts
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return 'Bs. 0.00';
  return `Bs. ${numPrice.toFixed(2)}`;
}
```

## File Reference

| File | Purpose |
|------|---------|
| `src/pages/SearchPage.tsx` | Main page, modal state |
| `src/components/search/SearchBar.tsx` | Input, keyboard nav, dropdown control |
| `src/components/search/SearchResults.tsx` | Results dropdown container |
| `src/components/search/SearchResultItem.tsx` | Individual product row |
| `src/components/search/StockIndicator.tsx` | Stock status badge |
| `src/hooks/useProductSearch.ts` | Search orchestration hook |
| `src/hooks/useDebounce.ts` | Debounce utility hook |
| `src/services/products.ts` | API service functions |
| `src/lib/api.ts` | Axios instance config |
| `src/lib/formatters.ts` | Price/margin formatting |
| `src/types/product.ts` | Product TypeScript types |

## Sequence Diagram

```
User          SearchBar       useProductSearch      products.ts        Backend
  │               │                  │                   │                │
  │ types "ace"   │                  │                   │                │
  │──────────────►│                  │                   │                │
  │               │ setSearchTerm    │                   │                │
  │               │ setIsOpen(true)  │                   │                │
  │               │                  │                   │                │
  │               │ (300ms debounce) │                   │                │
  │               │──────────────────►                   │                │
  │               │                  │ shouldSearch=true │                │
  │               │                  │ useQuery()        │                │
  │               │                  │──────────────────►│                │
  │               │                  │                   │ GET /search    │
  │               │                  │                   │───────────────►│
  │               │                  │                   │                │
  │               │                  │                   │ products[]     │
  │               │                  │                   │◄───────────────│
  │               │                  │◄──────────────────│                │
  │               │ data: products[] │                   │                │
  │               │◄─────────────────│                   │                │
  │ sees results  │                  │                   │                │
  │◄──────────────│                  │                   │                │
```

## Testing

Tests are located alongside their components:

- `src/hooks/useProductSearch.test.tsx` - Hook behavior
- `src/hooks/useDebounce.test.ts` - Debounce timing
- `src/services/products.test.ts` - API calls
- `src/lib/api.test.ts` - Axios interceptors

Run tests:
```bash
npm test
```

