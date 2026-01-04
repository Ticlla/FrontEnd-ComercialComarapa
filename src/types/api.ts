/**
 * Generic API response types matching backend models.
 * @see BackEnd-CC/src/comercial_comarapa/models/common.py
 */

// =============================================================================
// API RESPONSE WRAPPER
// =============================================================================

/**
 * Standard API response wrapper.
 */
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// =============================================================================
// PAGINATION
// =============================================================================

/**
 * Pagination metadata returned by list endpoints.
 */
export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

/**
 * Paginated response wrapper.
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message: string | null;
}

// =============================================================================
// ERROR RESPONSE
// =============================================================================

/**
 * Error response from API.
 */
export interface ErrorResponse {
  success: false;
  error: string;
  detail: string | null;
}

// =============================================================================
// DELETE RESPONSE
// =============================================================================

/**
 * Response from delete operations.
 */
export interface DeleteResponse {
  success: boolean;
  id: string;
  message: string;
}



