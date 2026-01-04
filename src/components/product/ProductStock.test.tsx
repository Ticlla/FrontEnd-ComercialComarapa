import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductStock } from './ProductStock';
import type { Product } from '../../types/product';

const createProduct = (stock: number, minLevel: number): Product => ({
  id: '123',
  sku: 'TEST-001',
  name: 'Test Product',
  description: null,
  category_id: null,
  unit_price: '25.00',
  cost_price: null,
  current_stock: stock,
  min_stock_level: minLevel,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  category: null,
});

describe('ProductStock', () => {
  it('displays "In Stock" when stock is above min level', () => {
    const product = createProduct(50, 10);
    
    render(<ProductStock product={product} />);
    
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Units in Stock')).toBeInTheDocument();
  });

  it('displays "Low Stock" when stock equals min level', () => {
    const product = createProduct(10, 10);
    
    render(<ProductStock product={product} />);
    
    expect(screen.getByText('Low Stock - Reorder Soon')).toBeInTheDocument();
  });

  it('displays "Low Stock" when stock is below min level but > 0', () => {
    const product = createProduct(5, 10);
    
    render(<ProductStock product={product} />);
    
    expect(screen.getByText('Low Stock - Reorder Soon')).toBeInTheDocument();
  });

  it('displays "Out of Stock" when stock is 0', () => {
    const product = createProduct(0, 10);
    
    render(<ProductStock product={product} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('displays min stock level', () => {
    const product = createProduct(50, 15);
    
    render(<ProductStock product={product} />);
    
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Min Level')).toBeInTheDocument();
  });

  it('shows units needed when low stock', () => {
    const product = createProduct(5, 10);
    
    render(<ProductStock product={product} />);
    
    // Units needed = minLevel - currentStock + 1 = 10 - 5 + 1 = 6
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Units Needed')).toBeInTheDocument();
  });

  it('shows units needed when out of stock', () => {
    const product = createProduct(0, 10);
    
    render(<ProductStock product={product} />);
    
    // Units needed = minLevel - currentStock + 1 = 10 - 0 + 1 = 11
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('Units Needed')).toBeInTheDocument();
  });

  it('does not show units needed when in stock', () => {
    const product = createProduct(50, 10);
    
    render(<ProductStock product={product} />);
    
    expect(screen.queryByText('Units Needed')).not.toBeInTheDocument();
  });
});




