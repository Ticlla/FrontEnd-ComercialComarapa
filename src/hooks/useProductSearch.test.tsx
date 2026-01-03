import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProductSearch } from './useProductSearch';
import * as productsService from '../services/products';
import type { ReactNode } from 'react';

// Mock the products service
vi.mock('../services/products', () => ({
  searchProducts: vi.fn(),
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

describe('useProductSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array for empty search term', () => {
    const { result } = renderHook(
      () => useProductSearch(''),
      { wrapper: createWrapper() }
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns empty array for whitespace-only search term', () => {
    const { result } = renderHook(
      () => useProductSearch('   '),
      { wrapper: createWrapper() }
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not call API for empty string', async () => {
    renderHook(
      () => useProductSearch('', { debounceMs: 0 }),
      { wrapper: createWrapper() }
    );

    // Wait a bit to ensure no call is made
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(productsService.searchProducts).not.toHaveBeenCalled();
  });

  it('calls API with search term (no debounce)', async () => {
    const mockProducts = [
      { id: '1', name: 'Arroz', sku: 'ARR-001' },
    ];
    vi.mocked(productsService.searchProducts).mockResolvedValue(mockProducts as any);

    const { result } = renderHook(
      () => useProductSearch('arroz', { debounceMs: 0 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockProducts);
    });

    expect(productsService.searchProducts).toHaveBeenCalledWith({
      q: 'arroz',
      limit: 10,
    });
  });

  it('respects custom limit option', async () => {
    vi.mocked(productsService.searchProducts).mockResolvedValue([]);

    renderHook(
      () => useProductSearch('test', { limit: 5, debounceMs: 0 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(productsService.searchProducts).toHaveBeenCalledWith({
        q: 'test',
        limit: 5,
      });
    });
  });

  it('respects minChars option', async () => {
    vi.mocked(productsService.searchProducts).mockResolvedValue([]);

    renderHook(
      () => useProductSearch('ab', { minChars: 3, debounceMs: 0 }),
      { wrapper: createWrapper() }
    );

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 50));

    // Should not search with 2 chars when minChars is 3
    expect(productsService.searchProducts).not.toHaveBeenCalled();
  });

  it('searches when meeting minChars threshold', async () => {
    vi.mocked(productsService.searchProducts).mockResolvedValue([]);

    renderHook(
      () => useProductSearch('abc', { minChars: 3, debounceMs: 0 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(productsService.searchProducts).toHaveBeenCalled();
    });
  });

  it('can be disabled', async () => {
    vi.mocked(productsService.searchProducts).mockResolvedValue([]);

    renderHook(
      () => useProductSearch('test', { enabled: false, debounceMs: 0 }),
      { wrapper: createWrapper() }
    );

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(productsService.searchProducts).not.toHaveBeenCalled();
  });

  it('trims search term before API call', async () => {
    vi.mocked(productsService.searchProducts).mockResolvedValue([]);

    renderHook(
      () => useProductSearch('  arroz  ', { debounceMs: 0 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(productsService.searchProducts).toHaveBeenCalledWith({
        q: 'arroz',
        limit: 10,
      });
    });
  });

  it('handles API errors gracefully', async () => {
    const mockError = new Error('Network error');
    vi.mocked(productsService.searchProducts).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useProductSearch('test', { debounceMs: 0 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toEqual([]);
  });
});
