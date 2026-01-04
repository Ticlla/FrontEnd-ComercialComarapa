import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { searchProducts } from '../services/products';
import type { Product } from '../types/product';

/**
 * Options for useProductSearch hook.
 */
export interface UseProductSearchOptions {
  /** Maximum number of results (default: 10) */
  limit?: number;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  /** Minimum characters to trigger search (default: 1) */
  minChars?: number;
  /** Enable/disable the query (default: true) */
  enabled?: boolean;
}

/**
 * Return type for useProductSearch hook.
 */
export interface UseProductSearchResult {
  /** Search results */
  data: Product[];
  /** Loading state */
  isLoading: boolean;
  /** Fetching state (includes background refetch) */
  isFetching: boolean;
  /** Error state */
  isError: boolean;
  /** Error object */
  error: Error | null;
  /** The debounced search term being used */
  debouncedTerm: string;
}

/**
 * Hook for searching products with debouncing and caching.
 *
 * Features:
 * - Automatic debouncing (default 300ms)
 * - React Query caching
 * - Minimum character threshold
 * - Loading/error states
 *
 * @param searchTerm - The search term entered by user
 * @param options - Configuration options
 * @returns Search results and state
 *
 * @example
 * ```tsx
 * const [term, setTerm] = useState('');
 * const { data, isLoading, isError } = useProductSearch(term);
 *
 * return (
 *   <input value={term} onChange={(e) => setTerm(e.target.value)} />
 *   {isLoading && <Spinner />}
 *   {data.map(product => <ProductItem key={product.id} product={product} />)}
 * );
 * ```
 */
export function useProductSearch(
  searchTerm: string,
  options: UseProductSearchOptions = {}
): UseProductSearchResult {
  const {
    limit = 10,
    debounceMs = 300,
    minChars = 2, // Guard against queries < 2 chars for better FTS/Trigram performance
    enabled = true,
  } = options;

  // Debounce the raw search term first, then trim
  // This prevents re-debouncing when only whitespace changes
  const debouncedRawTerm = useDebounce(searchTerm, debounceMs);
  const debouncedTerm = debouncedRawTerm.trim();

  // Determine if we should run the query
  const shouldSearch = enabled && debouncedTerm.length >= minChars;

  // Query for products
  // Note: queryKey includes limit so different limits have separate caches
  const query = useQuery({
    queryKey: ['products', 'search', debouncedTerm, limit],
    queryFn: () => searchProducts({ q: debouncedTerm, limit }),
    enabled: shouldSearch,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
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

export default useProductSearch;

