/**
 * Product API service functions.
 * @see BackEnd-CC/src/comercial_comarapa/api/v1/products.py
 */

import api from '../lib/api';
import type { APIResponse, PaginatedResponse } from '../types/api';
import type { Product, LowStockProduct } from '../types/product';

// =============================================================================
// SEARCH
// =============================================================================

export interface SearchProductsParams {
  q: string;
  limit?: number;
}

/**
 * Search products by name or SKU.
 * @param params - Search parameters
 * @returns List of matching products (empty array if search term is empty)
 */
export async function searchProducts(params: SearchProductsParams): Promise<Product[]> {
  const { q, limit = 10 } = params;
  
  // Skip API call for empty or whitespace-only search
  // Note: Caller (useProductSearch) already trims, but we validate here for safety
  if (!q || !q.trim()) {
    return [];
  }
  
  const response = await api.get<APIResponse<Product[]>>('/products/search', {
    params: { q, limit },
  });
  
  return response.data.data;
}

// =============================================================================
// GET BY ID
// =============================================================================

/**
 * Get a single product by ID.
 * @param id - Product UUID
 * @returns Product details
 */
export async function getProductById(id: string): Promise<Product> {
  const response = await api.get<APIResponse<Product>>(`/products/${id}`);
  return response.data.data;
}

// =============================================================================
// GET BY SKU
// =============================================================================

/**
 * Get a single product by SKU.
 * @param sku - Product SKU
 * @returns Product details
 */
export async function getProductBySku(sku: string): Promise<Product> {
  const response = await api.get<APIResponse<Product>>(`/products/sku/${encodeURIComponent(sku)}`);
  return response.data.data;
}

// =============================================================================
// LIST PRODUCTS
// =============================================================================

export interface ListProductsParams {
  page?: number;
  page_size?: number;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_active?: boolean;
}

/**
 * List products with optional filters.
 * @param params - Filter and pagination parameters
 * @returns Paginated list of products
 */
export async function listProducts(params: ListProductsParams = {}): Promise<PaginatedResponse<Product>> {
  const response = await api.get<PaginatedResponse<Product>>('/products', {
    params,
  });
  
  return response.data;
}

// =============================================================================
// LOW STOCK
// =============================================================================

/**
 * Get products with low stock levels.
 * @returns List of low stock products
 */
export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  const response = await api.get<APIResponse<LowStockProduct[]>>('/products/low-stock');
  return response.data.data;
}

