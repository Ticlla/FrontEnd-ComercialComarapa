/**
 * Multi-image uploader with drag & drop support.
 */

import { useCallback, useRef, useState } from 'react';
import { validateImageFiles } from '../../services/import';

// =============================================================================
// TYPES
// =============================================================================

interface MultiImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MultiImageUploader({
  onFilesSelected,
  maxFiles = 20,
  disabled = false,
}: MultiImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const validation = validateImageFiles(fileArray);

      if (!validation.valid) {
        setError(validation.error || 'Archivos inválidos');
        return;
      }

      setError(null);
      onFilesSelected(fileArray);
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [handleFiles]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {/* Icon */}
        <div className="flex flex-col items-center text-center">
          <div className={`
            w-16 h-16 mb-4 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-indigo-100' : 'bg-gray-100'}
          `}>
            <svg
              className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Text */}
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            {isDragging ? 'Suelta las imágenes aquí' : 'Arrastra imágenes de facturas'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            o haz clic para seleccionar archivos
          </p>

          {/* Specs */}
          <div className="flex flex-wrap gap-3 justify-center text-xs text-gray-400">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              Máx. {maxFiles} imágenes
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              JPEG, PNG, WebP
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              Hasta 10MB cada una
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}







