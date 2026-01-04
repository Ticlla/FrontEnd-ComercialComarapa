import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductInfo } from './ProductInfo';
import type { Product } from '../../types/product';

const mockProduct: Product = {
  id: '123',
  sku: 'TEST-001',
  name: 'Test Product',
  description: 'This is a test description',
  category_id: 'cat-1',
  unit_price: '25.00',
  cost_price: '18.00',
  current_stock: 50,
  min_stock_level: 10,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  category: {
    id: 'cat-1',
    name: 'Electronics',
    description: 'Electronic items',
  },
};

describe('ProductInfo', () => {
  it('displays the SKU', () => {
    render(<ProductInfo product={mockProduct} />);
    
    expect(screen.getByText('TEST-001')).toBeInTheDocument();
  });

  it('displays the category name when available', () => {
    render(<ProductInfo product={mockProduct} />);
    
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('does not show category when null', () => {
    const productWithoutCategory = {
      ...mockProduct,
      category: null,
    };
    
    render(<ProductInfo product={productWithoutCategory} />);
    
    expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
  });

  it('displays the description when available', () => {
    render(<ProductInfo product={mockProduct} />);
    
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('does not show description when null', () => {
    const productWithoutDescription = {
      ...mockProduct,
      description: null,
    };
    
    render(<ProductInfo product={productWithoutDescription} />);
    
    expect(screen.queryByText('This is a test description')).not.toBeInTheDocument();
  });
});




