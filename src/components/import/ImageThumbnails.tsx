/**
 * Image thumbnails navigation strip.
 */

import { useMemo } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface ImageThumbnailsProps {
  files: File[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  extractionConfidences?: number[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ImageThumbnails({
  files,
  selectedIndex,
  onSelect,
  extractionConfidences = [],
}: ImageThumbnailsProps) {
  // Create object URLs for thumbnails
  const thumbnailUrls = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  // Cleanup object URLs on unmount
  useMemo(() => {
    return () => {
      thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbnailUrls]);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 p-3 bg-gray-100 border-b border-gray-200 overflow-x-auto">
      {files.map((file, index) => {
        const isSelected = index === selectedIndex;
        const confidence = extractionConfidences[index];
        const hasLowConfidence = confidence !== undefined && confidence < 0.7;

        return (
          <button
            key={`${file.name}-${index}`}
            onClick={() => onSelect(index)}
            className={`
              relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden
              border-2 transition-all
              ${isSelected
                ? 'border-indigo-500 ring-2 ring-indigo-200'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            {/* Thumbnail Image */}
            <img
              src={thumbnailUrls[index]}
              alt={`Imagen ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Index Badge */}
            <span
              className={`
                absolute top-1 left-1 w-5 h-5 rounded-full
                text-xs font-medium flex items-center justify-center
                ${isSelected
                  ? 'bg-indigo-500 text-white'
                  : 'bg-black/50 text-white'
                }
              `}
            >
              {index + 1}
            </span>

            {/* Low Confidence Warning */}
            {hasLowConfidence && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}




