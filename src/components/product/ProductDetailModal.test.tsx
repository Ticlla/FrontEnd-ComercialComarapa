import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductDetailModal } from './ProductDetailModal';
import * as productsService from '../../services/products';
import type { ReactNode } from 'react';

// Mock the products service
vi.mock('../../services/products', () => ({
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

describe('ProductDetailModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ProductDetailModal
        productId="123"
        isOpen={false}
        onClose={() => {}}
      />,
      { wrapper: createWrapper() }
    );
    
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('shows loading state when fetching', async () => {
    // Make the fetch hang
    vi.mocked(productsService.getProductById).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <ProductDetailModal
        productId="123"
        isOpen={true}
        onClose={() => {}}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading product...')).toBeInTheDocument();
  });

  it('shows product details after loading', async () => {
    vi.mocked(productsService.getProductById).mockResolvedValue(mockProduct);

    render(
      <ProductDetailModal
        productId="123"
        isOpen={true}
        onClose={() => {}}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Check product info is displayed
    expect(screen.getByText('TEST-001')).toBeInTheDocument();
    expect(screen.getByText('Bs. 25.00')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('shows error state on fetch failure', async () => {
    vi.mocked(productsService.getProductById).mockRejectedValue(
      new Error('Product not found')
    );

    render(
      <ProductDetailModal
        productId="invalid"
        isOpen={true}
        onClose={() => {}}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Error loading product')).toBeInTheDocument();
  });

  it('does not fetch when productId is null', async () => {
    render(
      <ProductDetailModal
        productId={null}
        isOpen={true}
        onClose={() => {}}
      />,
      { wrapper: createWrapper() }
    );

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(productsService.getProductById).not.toHaveBeenCalled();
  });

  it('calls onClose when modal is closed', async () => {
    vi.mocked(productsService.getProductById).mockResolvedValue(mockProduct);
    const onClose = vi.fn();

    render(
      <ProductDetailModal
        productId="123"
        isOpen={true}
        onClose={onClose}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Click close button
    const closeButton = screen.getByLabelText('Close modal');
    closeButton.click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

