import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductPricing } from './ProductPricing';
import type { Product } from '../../types/product';

const mockProduct: Product = {
  id: '123',
  sku: 'TEST-001',
  name: 'Test Product',
  description: null,
  category_id: null,
  unit_price: '100.00',
  cost_price: '80.00',
  current_stock: 50,
  min_stock_level: 10,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  category: null,
};

describe('ProductPricing', () => {
  it('displays unit price formatted correctly', () => {
    render(<ProductPricing product={mockProduct} />);
    
    expect(screen.getByText('Bs. 100.00')).toBeInTheDocument();
    expect(screen.getByText('Unit Price')).toBeInTheDocument();
  });

  it('displays cost price when available', () => {
    render(<ProductPricing product={mockProduct} />);
    
    expect(screen.getByText('Bs. 80.00')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('does not show cost when null', () => {
    const productWithoutCost = {
      ...mockProduct,
      cost_price: null,
    };
    
    render(<ProductPricing product={productWithoutCost} />);
    
    expect(screen.queryByText('Bs. 80.00')).not.toBeInTheDocument();
    expect(screen.queryByText('Cost')).not.toBeInTheDocument();
  });

  it('displays positive margin correctly', () => {
    render(<ProductPricing product={mockProduct} />);
    
    // Margin = (100 - 80) / 100 * 100 = 20%
    expect(screen.getByText('20.0%')).toBeInTheDocument();
    expect(screen.getByText('Margin')).toBeInTheDocument();
  });

  it('displays high margin in green (>= 20%)', () => {
    const highMarginProduct = {
      ...mockProduct,
      unit_price: '100.00',
      cost_price: '50.00', // 50% margin
    };
    
    render(<ProductPricing product={highMarginProduct} />);
    
    expect(screen.getByText('50.0%')).toBeInTheDocument();
    expect(screen.getByText('Margin')).toBeInTheDocument();
  });

  it('displays low margin in yellow (< 20%)', () => {
    const lowMarginProduct = {
      ...mockProduct,
      unit_price: '100.00',
      cost_price: '90.00', // 10% margin
    };
    
    render(<ProductPricing product={lowMarginProduct} />);
    
    expect(screen.getByText('10.0%')).toBeInTheDocument();
  });

  it('displays negative margin as Loss in red', () => {
    const negativeMarginProduct = {
      ...mockProduct,
      unit_price: '80.00',
      cost_price: '100.00', // -25% margin (losing money)
    };
    
    render(<ProductPricing product={negativeMarginProduct} />);
    
    expect(screen.getByText('-25.0%')).toBeInTheDocument();
    expect(screen.getByText('Loss')).toBeInTheDocument();
  });

  it('handles string prices correctly', () => {
    const stringPriceProduct = {
      ...mockProduct,
      unit_price: '25.50',
      cost_price: '15.30',
    };
    
    render(<ProductPricing product={stringPriceProduct} />);
    
    expect(screen.getByText('Bs. 25.50')).toBeInTheDocument();
    expect(screen.getByText('Bs. 15.30')).toBeInTheDocument();
  });
});



