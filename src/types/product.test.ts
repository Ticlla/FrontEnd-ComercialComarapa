import { describe, it, expect } from 'vitest';
import {
  getStockStatus,
  isLowStock,
  isOutOfStock,
  type StockStatus,
} from './product';

describe('getStockStatus', () => {
  it('returns "out_of_stock" when current stock is 0', () => {
    expect(getStockStatus(0, 10)).toBe('out_of_stock');
    expect(getStockStatus(0, 0)).toBe('out_of_stock');
  });

  it('returns "low_stock" when current stock is at or below minimum', () => {
    expect(getStockStatus(5, 10)).toBe('low_stock');
    expect(getStockStatus(10, 10)).toBe('low_stock');
    expect(getStockStatus(1, 5)).toBe('low_stock');
  });

  it('returns "in_stock" when current stock is above minimum', () => {
    expect(getStockStatus(11, 10)).toBe('in_stock');
    expect(getStockStatus(100, 10)).toBe('in_stock');
    expect(getStockStatus(6, 5)).toBe('in_stock');
  });

  it('handles edge cases correctly', () => {
    // Stock exactly at minimum
    expect(getStockStatus(5, 5)).toBe('low_stock');
    // Stock just above minimum
    expect(getStockStatus(6, 5)).toBe('in_stock');
    // Zero minimum stock level
    expect(getStockStatus(1, 0)).toBe('in_stock');
    expect(getStockStatus(0, 0)).toBe('out_of_stock');
  });
});

describe('isLowStock', () => {
  it('returns true when stock is at or below minimum', () => {
    expect(isLowStock({ current_stock: 5, min_stock_level: 10 })).toBe(true);
    expect(isLowStock({ current_stock: 10, min_stock_level: 10 })).toBe(true);
    expect(isLowStock({ current_stock: 0, min_stock_level: 10 })).toBe(true);
  });

  it('returns false when stock is above minimum', () => {
    expect(isLowStock({ current_stock: 11, min_stock_level: 10 })).toBe(false);
    expect(isLowStock({ current_stock: 100, min_stock_level: 10 })).toBe(false);
  });

  it('returns true for out of stock (stock = 0)', () => {
    // Note: This is documented behavior - isLowStock returns true for out_of_stock
    expect(isLowStock({ current_stock: 0, min_stock_level: 5 })).toBe(true);
  });
});

describe('isOutOfStock', () => {
  it('returns true when stock is 0', () => {
    expect(isOutOfStock({ current_stock: 0 })).toBe(true);
  });

  it('returns false when stock is greater than 0', () => {
    expect(isOutOfStock({ current_stock: 1 })).toBe(false);
    expect(isOutOfStock({ current_stock: 100 })).toBe(false);
  });
});

describe('StockStatus type coverage', () => {
  it('covers all stock status values', () => {
    const statuses: StockStatus[] = ['in_stock', 'low_stock', 'out_of_stock'];
    
    // Ensure getStockStatus can return all values
    expect(statuses).toContain(getStockStatus(100, 10)); // in_stock
    expect(statuses).toContain(getStockStatus(5, 10));   // low_stock
    expect(statuses).toContain(getStockStatus(0, 10));   // out_of_stock
  });
});

