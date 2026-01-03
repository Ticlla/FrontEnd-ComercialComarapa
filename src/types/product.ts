/**
 * Product TypeScript interfaces matching backend models.
 * @see BackEnd-CC/src/comercial_comarapa/models/product.py
 */

// =============================================================================
// CATEGORY
// =============================================================================

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

// =============================================================================
// PRODUCT
// =============================================================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category_id: string | null;
  unit_price: number;
  cost_price: number | null;
  current_stock: number;
  min_stock_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: Category | null;
}

// =============================================================================
// LOW STOCK PRODUCT
// =============================================================================

export interface LowStockProduct {
  id: string;
  sku: string;
  name: string;
  category_name: string | null;
  current_stock: number;
  min_stock_level: number;
  units_needed: number;
}

// =============================================================================
// STOCK STATUS HELPERS
// =============================================================================

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

/**
 * Determine stock status based on current stock and minimum level.
 */
export function getStockStatus(currentStock: number, minStockLevel: number): StockStatus {
  if (currentStock === 0) return 'out_of_stock';
  if (currentStock <= minStockLevel) return 'low_stock';
  return 'in_stock';
}

/**
 * Check if product has low stock (at or below minimum).
 * Note: Returns true for out-of-stock products (stock = 0).
 * Use in combination with isOutOfStock() for precise status.
 */
export function isLowStock(product: Pick<Product, 'current_stock' | 'min_stock_level'>): boolean {
  return product.current_stock <= product.min_stock_level;
}

/**
 * Check if product is out of stock.
 */
export function isOutOfStock(product: Pick<Product, 'current_stock'>): boolean {
  return product.current_stock === 0;
}

