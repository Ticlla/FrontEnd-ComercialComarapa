/**
 * Import Page - Main page for importing products from invoice images.
 */

import { useCallback } from 'react';
import {
  MultiImageUploader,
  ProcessingIndicator,
  ExtractedItemsList,
} from '../components/import';
import { useImportState } from '../hooks/useImportState';
import { useBatchExtraction } from '../hooks/useBatchExtraction';

// =============================================================================
// COMPONENT
// =============================================================================

export function ImportPage() {
  const {
    state,
    setFiles,
    startProcessing,
    setExtractionResult,
    setError,
    selectProduct,
    startEditing,
    reset,
    allProducts,
    newProductsCount,
    matchedProductsCount,
  } = useImportState();

  const { extract, isExtracting, progress, error: extractionError } = useBatchExtraction();

  // Handle file selection
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      setFiles(files);
      startProcessing();

      const result = await extract(files);

      if (result) {
        setExtractionResult(result);
      } else if (extractionError) {
        setError(extractionError);
      }
    },
    [setFiles, startProcessing, extract, setExtractionResult, setError, extractionError]
  );

  // Render based on current step
  const renderContent = () => {
    switch (state.step) {
      case 'upload':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Importar Productos
              </h1>
              <p className="text-gray-600 max-w-md">
                Sube fotos de tus notas de venta y extraeremos los productos
                automáticamente usando inteligencia artificial.
              </p>
            </div>
            <MultiImageUploader
              onFilesSelected={handleFilesSelected}
              disabled={isExtracting}
            />
          </div>
        );

      case 'processing':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <ProcessingIndicator
              progress={progress}
              filesCount={state.files.length}
            />
          </div>
        );

      case 'review':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Resultados de Extracción
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {state.extractionResult?.total_images_processed} imagen(es) procesada(s)
                    en {((state.extractionResult?.processing_time_ms || 0) / 1000).toFixed(1)}s
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Stats */}
                  <div className="flex gap-4 text-sm">
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {newProductsCount} nuevos
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      {matchedProductsCount} coincidencias
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={reset}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Nueva Importación
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Image Preview (placeholder) */}
              <div className="w-1/2 border-r border-gray-200 bg-gray-50 flex items-center justify-center">
                <div className="text-center text-gray-500 p-8">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">
                    Vista previa de imagen
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    (Próximamente)
                  </p>
                </div>
              </div>

              {/* Right Panel - Products List */}
              <div className="w-1/2 flex flex-col bg-white">
                <ExtractedItemsList
                  products={allProducts}
                  selectedIndex={state.selectedProductIndex}
                  onSelectProduct={selectProduct}
                  onEditProduct={startEditing}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Error Banner */}
      {(state.error || extractionError) && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 text-sm">
              {state.error || extractionError}
            </span>
            <button
              onClick={reset}
              className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}

