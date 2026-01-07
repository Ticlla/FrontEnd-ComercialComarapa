/**
 * Hook for managing import workflow state.
 */

import { useCallback, useMemo, useReducer } from 'react';
import type {
  BatchExtractionResponse,
  EditableProduct,
  ImportState,
  ImportStep,
  MatchedProduct,
} from '../types/import';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: ImportState = {
  step: 'upload',
  files: [],
  extractionResult: null,
  selectedInvoiceIndex: 0,
  selectedProductIndex: null,
  editingProduct: null,
  isProcessing: false,
  error: null,
};

// =============================================================================
// ACTIONS
// =============================================================================

type ImportAction =
  | { type: 'SET_FILES'; files: File[] }
  | { type: 'START_PROCESSING' }
  | { type: 'SET_EXTRACTION_RESULT'; result: BatchExtractionResponse }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SELECT_INVOICE'; index: number }
  | { type: 'SELECT_PRODUCT'; index: number | null }
  | { type: 'START_EDITING'; product: MatchedProduct }
  | { type: 'STOP_EDITING' }
  | { type: 'SET_STEP'; step: ImportStep }
  | { type: 'RESET' };

// =============================================================================
// REDUCER
// =============================================================================

function importReducer(state: ImportState, action: ImportAction): ImportState {
  switch (action.type) {
    case 'SET_FILES':
      return {
        ...state,
        files: action.files,
        error: null,
      };

    case 'START_PROCESSING':
      return {
        ...state,
        step: 'processing',
        isProcessing: true,
        error: null,
      };

    case 'SET_EXTRACTION_RESULT':
      return {
        ...state,
        step: 'review',
        extractionResult: action.result,
        isProcessing: false,
        selectedInvoiceIndex: 0,
        selectedProductIndex: null,
      };

    case 'SET_ERROR':
      return {
        ...state,
        isProcessing: false,
        error: action.error,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SELECT_INVOICE':
      return {
        ...state,
        selectedInvoiceIndex: action.index,
        selectedProductIndex: null,
        editingProduct: null,
      };

    case 'SELECT_PRODUCT':
      return {
        ...state,
        selectedProductIndex: action.index,
      };

    case 'START_EDITING':
      return {
        ...state,
        editingProduct: action.product,
      };

    case 'STOP_EDITING':
      return {
        ...state,
        editingProduct: null,
      };

    case 'SET_STEP':
      return {
        ...state,
        step: action.step,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// =============================================================================
// HOOK
// =============================================================================

export interface UseImportStateReturn {
  state: ImportState;
  // Actions
  setFiles: (files: File[]) => void;
  startProcessing: () => void;
  setExtractionResult: (result: BatchExtractionResponse) => void;
  setError: (error: string) => void;
  clearError: () => void;
  selectInvoice: (index: number) => void;
  selectProduct: (index: number | null) => void;
  startEditing: (product: MatchedProduct) => void;
  stopEditing: () => void;
  setStep: (step: ImportStep) => void;
  reset: () => void;
  // Computed values
  currentInvoice: BatchExtractionResponse['extractions'][0] | null;
  currentProducts: MatchedProduct[];
  allProducts: MatchedProduct[];
  newProductsCount: number;
  matchedProductsCount: number;
}

export function useImportState(): UseImportStateReturn {
  const [state, dispatch] = useReducer(importReducer, initialState);

  // Actions
  const setFiles = useCallback((files: File[]) => {
    dispatch({ type: 'SET_FILES', files });
  }, []);

  const startProcessing = useCallback(() => {
    dispatch({ type: 'START_PROCESSING' });
  }, []);

  const setExtractionResult = useCallback((result: BatchExtractionResponse) => {
    dispatch({ type: 'SET_EXTRACTION_RESULT', result });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const selectInvoice = useCallback((index: number) => {
    dispatch({ type: 'SELECT_INVOICE', index });
  }, []);

  const selectProduct = useCallback((index: number | null) => {
    dispatch({ type: 'SELECT_PRODUCT', index });
  }, []);

  const startEditing = useCallback((product: MatchedProduct) => {
    dispatch({ type: 'START_EDITING', product });
  }, []);

  const stopEditing = useCallback(() => {
    dispatch({ type: 'STOP_EDITING' });
  }, []);

  const setStep = useCallback((step: ImportStep) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Computed values
  const currentInvoice = useMemo(() => {
    if (!state.extractionResult) return null;
    return state.extractionResult.extractions[state.selectedInvoiceIndex] || null;
  }, [state.extractionResult, state.selectedInvoiceIndex]);

  const allProducts = useMemo(() => {
    return state.extractionResult?.matched_products || [];
  }, [state.extractionResult]);

  const currentProducts = useMemo(() => {
    if (!state.extractionResult || !currentInvoice) return [];

    // Get products for this invoice (by position in extractions array)
    let startIdx = 0;
    for (let i = 0; i < state.selectedInvoiceIndex; i++) {
      startIdx += state.extractionResult.extractions[i].products.length;
    }
    const endIdx = startIdx + currentInvoice.products.length;

    return allProducts.slice(startIdx, endIdx);
  }, [state.extractionResult, state.selectedInvoiceIndex, currentInvoice, allProducts]);

  const newProductsCount = useMemo(() => {
    return allProducts.filter((p) => p.is_new_product).length;
  }, [allProducts]);

  const matchedProductsCount = useMemo(() => {
    return allProducts.filter((p) => !p.is_new_product).length;
  }, [allProducts]);

  return {
    state,
    setFiles,
    startProcessing,
    setExtractionResult,
    setError,
    clearError,
    selectInvoice,
    selectProduct,
    startEditing,
    stopEditing,
    setStep,
    reset,
    currentInvoice,
    currentProducts,
    allProducts,
    newProductsCount,
    matchedProductsCount,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Convert MatchedProduct to EditableProduct for editing.
 */
export function toEditableProduct(matched: MatchedProduct): EditableProduct {
  return {
    ...matched,
    editedName: matched.suggested_name,
    editedDescription: matched.extracted.description,
    editedCategoryId: null,
    editedCategoryName: matched.extracted.suggested_category,
    editedUnitPrice: matched.extracted.unit_price,
    editedCostPrice: null,
    shouldCreate: matched.is_new_product,
    linkedProductId: matched.matches[0]?.existing_product_id || null,
  };
}

