/**
 * Import TypeScript interfaces matching backend models.
 * @see BackEnd-CC/src/comercial_comarapa/models/import_extraction.py
 */

// =============================================================================
// ENUMS
// =============================================================================

export type MatchConfidence = 'high' | 'medium' | 'low';

// =============================================================================
// EXTRACTED DATA (from AI)
// =============================================================================

export interface ExtractedInvoice {
  supplier_name: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  image_index: number;
}

export interface ExtractedProduct {
  quantity: number;
  description: string;
  unit_price: number;
  total_price: number;
  suggested_category: string | null;
}

export interface ExtractionResult {
  invoice: ExtractedInvoice;
  products: ExtractedProduct[];
  extraction_confidence: number;
  raw_text?: string;
}

// =============================================================================
// MATCHING RESULTS
// =============================================================================

export interface ProductMatch {
  existing_product_id: string;
  existing_product_name: string;
  existing_product_sku: string;
  similarity_score: number;
  confidence: MatchConfidence;
}

export interface MatchedProduct {
  extracted: ExtractedProduct;
  matches: ProductMatch[];
  is_new_product: boolean;
  suggested_name: string;
}

export interface DetectedCategory {
  name: string;
  exists_in_catalog: boolean;
  existing_category_id: string | null;
  product_count: number;
}

// =============================================================================
// API RESPONSES
// =============================================================================

export interface BatchExtractionResponse {
  extractions: ExtractionResult[];
  matched_products: MatchedProduct[];
  detected_categories: DetectedCategory[];
  total_products: number;
  total_images_processed: number;
  processing_time_ms: number;
}

export interface MatchProductResponse {
  matched: MatchedProduct;
  processing_time_ms: number;
}

export interface AutocompleteSuggestion {
  name: string;
  description: string;
  category: string | null;
}

export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
}

// =============================================================================
// BULK CREATE
// =============================================================================

export interface BulkProductItem {
  name: string;
  description?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  unit_price: number;
  cost_price?: number | null;
  min_stock_level?: number;
}

export interface BulkCreateRequest {
  products: BulkProductItem[];
  create_missing_categories?: boolean;
}

export interface BulkCreateResultItem {
  index: number;
  success: boolean;
  product_id: string | null;
  product_sku: string | null;
  error: string | null;
}

export interface BulkCreateResponse {
  total_requested: number;
  total_created: number;
  total_failed: number;
  results: BulkCreateResultItem[];
  categories_created: number;
  processing_time_ms: number;
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

export interface ImportHealthResponse {
  status: 'healthy' | 'degraded';
  ai_configured: boolean;
  ai_model: string | null;
  max_images_per_batch: number;
  max_image_size_mb: number;
}

// =============================================================================
// UI STATE TYPES
// =============================================================================

export type ImportStep = 'upload' | 'processing' | 'review' | 'creating';

export interface ImportState {
  step: ImportStep;
  files: File[];
  extractionResult: BatchExtractionResponse | null;
  selectedInvoiceIndex: number;
  selectedProductIndex: number | null;
  editingProduct: MatchedProduct | null;
  isProcessing: boolean;
  error: string | null;
}

export interface EditableProduct extends MatchedProduct {
  /** User-edited name (may differ from suggested_name) */
  editedName: string;
  /** User-edited description */
  editedDescription: string;
  /** User-selected category ID or name */
  editedCategoryId: string | null;
  editedCategoryName: string | null;
  /** User-edited unit price */
  editedUnitPrice: number;
  /** User-edited cost price */
  editedCostPrice: number | null;
  /** Whether user wants to create this product */
  shouldCreate: boolean;
  /** Whether user wants to link to existing product */
  linkedProductId: string | null;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get confidence badge color based on match confidence.
 */
export function getConfidenceColor(confidence: MatchConfidence): string {
  switch (confidence) {
    case 'high':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Format confidence as percentage.
 */
export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Check if a product needs user review (low confidence or new).
 */
export function needsReview(matched: MatchedProduct): boolean {
  if (matched.is_new_product) return true;
  if (matched.matches.length === 0) return true;
  return matched.matches[0].confidence === 'low';
}







