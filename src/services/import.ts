/**
 * Import API service functions.
 * @see BackEnd-CC/src/comercial_comarapa/api/v1/import_products.py
 */

import api from '../lib/api';
import type {
  AutocompleteResponse,
  BatchExtractionResponse,
  BulkCreateRequest,
  BulkCreateResponse,
  ImportHealthResponse,
  MatchProductResponse,
} from '../types/import';

// =============================================================================
// CONSTANTS
// =============================================================================

const IMPORT_TIMEOUT = 120000; // 2 minutes for AI processing

// =============================================================================
// HEALTH CHECK
// =============================================================================

/**
 * Check if import service is healthy and configured.
 * @returns Health status with configuration info
 */
export async function checkImportHealth(): Promise<ImportHealthResponse> {
  const response = await api.get<ImportHealthResponse>('/import/health');
  return response.data;
}

// =============================================================================
// BATCH EXTRACTION
// =============================================================================

/**
 * Extract products from multiple invoice images.
 * @param files - Array of image files (max 20)
 * @returns Batch extraction response with matched products
 */
export async function extractFromImages(files: File[]): Promise<BatchExtractionResponse> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  const response = await api.post<BatchExtractionResponse>(
    '/import/extract-from-images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: IMPORT_TIMEOUT,
    }
  );
  
  return response.data;
}

// =============================================================================
// SINGLE IMAGE EXTRACTION
// =============================================================================

export interface ExtractFromImageParams {
  imageBase64: string;
  imageType: string;
}

/**
 * Extract products from a single base64-encoded image.
 * @param params - Image data and type
 * @returns Extraction result
 */
export async function extractFromImage(params: ExtractFromImageParams): Promise<BatchExtractionResponse> {
  const response = await api.post<BatchExtractionResponse>(
    '/import/extract-from-image',
    {
      image_base64: params.imageBase64,
      image_type: params.imageType,
    },
    {
      timeout: IMPORT_TIMEOUT,
    }
  );
  
  return response.data;
}

// =============================================================================
// PRODUCT MATCHING
// =============================================================================

export interface MatchProductParams {
  description: string;
  suggestedCategory?: string | null;
}

/**
 * Match a product description against existing catalog.
 * @param params - Product description and optional category
 * @returns Matching result with suggestions
 */
export async function matchProduct(params: MatchProductParams): Promise<MatchProductResponse> {
  const response = await api.post<MatchProductResponse>('/import/match-products', {
    description: params.description,
    suggested_category: params.suggestedCategory,
  });
  
  return response.data;
}

// =============================================================================
// AI AUTOCOMPLETE
// =============================================================================

export interface AutocompleteParams {
  partialText: string;
  context?: string | null;
}

/**
 * Get AI autocomplete suggestions for product name/description.
 * @param params - Partial text and optional context
 * @returns List of suggestions
 */
export async function getAutocompleteSuggestions(
  params: AutocompleteParams
): Promise<AutocompleteResponse> {
  const response = await api.post<AutocompleteResponse>('/import/autocomplete-product', {
    partial_text: params.partialText,
    context: params.context,
  });
  
  return response.data;
}

// =============================================================================
// BULK CREATE
// =============================================================================

/**
 * Create multiple products at once.
 * @param request - Products to create and options
 * @returns Results for each product
 */
export async function bulkCreateProducts(request: BulkCreateRequest): Promise<BulkCreateResponse> {
  const response = await api.post<BulkCreateResponse>('/import/bulk-create', request);
  return response.data;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Convert a File to base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file before upload.
 */
export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

const MAX_IMAGE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function validateImageFile(file: File): ImageValidationResult {
  // Check type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo no soportado: ${file.type}. Usa JPEG, PNG o WebP.`,
    };
  }
  
  // Check size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_IMAGE_SIZE_MB) {
    return {
      valid: false,
      error: `Archivo muy grande (${sizeMB.toFixed(1)}MB). Máximo: ${MAX_IMAGE_SIZE_MB}MB.`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate multiple image files.
 */
export function validateImageFiles(files: File[]): ImageValidationResult {
  const MAX_FILES = 20;
  
  if (files.length === 0) {
    return { valid: false, error: 'No se seleccionaron archivos.' };
  }
  
  if (files.length > MAX_FILES) {
    return { valid: false, error: `Máximo ${MAX_FILES} imágenes por lote.` };
  }
  
  for (const file of files) {
    const result = validateImageFile(file);
    if (!result.valid) {
      return { valid: false, error: `${file.name}: ${result.error}` };
    }
  }
  
  return { valid: true };
}






