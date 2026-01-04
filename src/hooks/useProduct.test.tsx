import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProduct } from './useProduct';
import * as productsService from '../services/products';
import type { ReactNode } from 'react';

// Mock the products service
vi.mock('../services/products', () => ({
  getProductById: vi.fn(),
}));

// Create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

const mockProduct = {
  id: '123',
  sku: 'TEST-001',
  name: 'Test Product',
  description: 'Test description',
  category_id: null,
  unit_price: '25.00',
  cost_price: '18.00',
  current_stock: 50,
  min_stock_level: 10,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  category: null,
};

describe('useProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch when productId is null', async () => {
    const { result } = renderHook(
      () => useProduct(null),
      { wrapper: createWrapper() }
    );

    // Wait a bit to ensure no fetch happens
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(productsService.getProductById).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('fetches product when productId is provided', async () => {
    vi.mocked(productsService.getProductById).mockResolvedValue(mockProduct);

    const { result } = renderHook(
      () => useProduct('123'),
      { wrapper: createWrapper() }
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockProduct);
    });

    expect(productsService.getProductById).toHaveBeenCalledWith('123');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('handles fetch error', async () => {
    const mockError = new Error('Product not found');
    vi.mocked(productsService.getProductById).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useProduct('invalid-id'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });

  it('refetches when productId changes', async () => {
    const product1 = { ...mockProduct, id: '1', name: 'Product 1' };
    const product2 = { ...mockProduct, id: '2', name: 'Product 2' };

    vi.mocked(productsService.getProductById)
      .mockResolvedValueOnce(product1)
      .mockResolvedValueOnce(product2);

    const { result, rerender } = renderHook(
      ({ id }) => useProduct(id),
      { wrapper: createWrapper(), initialProps: { id: '1' } }
    );

    await waitFor(() => {
      expect(result.current.data?.name).toBe('Product 1');
    });

    rerender({ id: '2' });

    await waitFor(() => {
      expect(result.current.data?.name).toBe('Product 2');
    });

    expect(productsService.getProductById).toHaveBeenCalledTimes(2);
  });

  it('provides refetch function', async () => {
    vi.mocked(productsService.getProductById).mockResolvedValue(mockProduct);

    const { result } = renderHook(
      () => useProduct('123'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(typeof result.current.refetch).toBe('function');
  });
});

