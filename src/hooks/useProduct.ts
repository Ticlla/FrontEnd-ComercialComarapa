import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/products';
import type { Product } from '../types/product';

/**
 * Return type for useProduct hook.
 */
export interface UseProductResult {
  /** Product data */
  data: Product | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  isError: boolean;
  /** Error object */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook for fetching a single product by ID.
 * 
 * Features:
 * - React Query caching (5 minutes stale time)
 * - Automatic refetch on window focus
 * - Only fetches when productId is provided
 * 
 * @param productId - Product UUID or null
 * @returns Product data and state
 * 
 * @example
 * ```tsx
 * const { data: product, isLoading, isError } = useProduct(selectedProductId);
 * 
 * if (isLoading) return <Spinner />;
 * if (isError) return <Error />;
 * if (product) return <ProductDetail product={product} />;
 * ```
 */
export function useProduct(productId: string | null): UseProductResult {
  const query = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading && !!productId,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useProduct;




