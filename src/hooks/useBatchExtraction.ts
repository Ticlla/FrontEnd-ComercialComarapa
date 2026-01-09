/**
 * Hook for batch image extraction with progress tracking.
 */

import { useCallback, useState } from 'react';
import { extractFromImages, validateImageFiles } from '../services/import';
import { getErrorMessage } from '../lib/api';
import type { BatchExtractionResponse } from '../types/import';

// =============================================================================
// TYPES
// =============================================================================

export interface UseBatchExtractionReturn {
  /** Extract products from image files */
  extract: (files: File[]) => Promise<BatchExtractionResponse | null>;
  /** Whether extraction is in progress */
  isExtracting: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Error message if extraction failed */
  error: string | null;
  /** Clear error state */
  clearError: () => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useBatchExtraction(): UseBatchExtractionReturn {
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const extract = useCallback(async (files: File[]): Promise<BatchExtractionResponse | null> => {
    // Validate files first
    const validation = validateImageFiles(files);
    if (!validation.valid) {
      setError(validation.error || 'Archivos inválidos');
      return null;
    }

    setIsExtracting(true);
    setProgress(10); // Start progress
    setError(null);

    try {
      // Simulate progress during API call
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Slowly increase progress, max 90% until complete
          if (prev < 90) {
            return prev + Math.random() * 10;
          }
          return prev;
        });
      }, 500);

      const result = await extractFromImages(files);

      clearInterval(progressInterval);
      setProgress(100);

      return result;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsExtracting(false);
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 500);
    }
  }, []);

  return {
    extract,
    isExtracting,
    progress,
    error,
    clearError,
  };
}






