/**
 * Import Page - Main page for importing products from invoice images.
 */

import { useCallback, useState, useMemo } from 'react';
import {
  MultiImageUploader,
  ProcessingIndicator,
  ExtractedItemsList,
  ImageThumbnails,
  InvoiceTabs,
  ConsolidatedView,
  ExtractedItemEditor,
  CreateProductModal,
  CreateCategoryModal,
} from '../components/import';
import type { EditedProductData } from '../components/import';
import { useImportState } from '../hooks/useImportState';
import { useBatchExtraction } from '../hooks/useBatchExtraction';
import { bulkCreateProducts } from '../services/import';
import type { BulkProductItem } from '../types/import';

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
    selectInvoice,
    selectProduct,
    startEditing,
    stopEditing,
    setStep,
    reset,
    currentProducts,
    allProducts,
    newProductsCount,
    matchedProductsCount,
  } = useImportState();

  const { extract, isExtracting, progress, error: extractionError } = useBatchExtraction();

  // Modal states
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [productToCreate, setProductToCreate] = useState<Partial<BulkProductItem> | null>(null);

  // Tab state: 'all' or invoice index
  const [activeTab, setActiveTab] = useState<'all' | number>('all');

  // Edited products state (for tracking user edits before bulk create)
  const [editedProducts, setEditedProducts] = useState<Map<number, EditedProductData>>(new Map());

  // Computed: products to display based on active tab
  const displayProducts = useMemo(() => {
    if (activeTab === 'all') {
      return allProducts;
    }
    return currentProducts;
  }, [activeTab, allProducts, currentProducts]);

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

  // Handle tab change
  const handleTabChange = useCallback((index: 'all' | number) => {
    setActiveTab(index);
    if (typeof index === 'number') {
      selectInvoice(index);
    }
    stopEditing();
  }, [selectInvoice, stopEditing]);

  // Handle thumbnail click
  const handleThumbnailClick = useCallback((index: number) => {
    setActiveTab(index);
    selectInvoice(index);
    stopEditing();
  }, [selectInvoice, stopEditing]);

  // Handle edit save
  const handleEditSave = useCallback((data: EditedProductData) => {
    if (state.selectedProductIndex !== null) {
      setEditedProducts((prev) => {
        const next = new Map(prev);
        next.set(state.selectedProductIndex!, data);
        return next;
      });
    }
    stopEditing();
  }, [state.selectedProductIndex, stopEditing]);

  // Handle product creation
  const handleProductCreate = useCallback(async (product: BulkProductItem) => {
    setIsCreating(true);
    try {
      const response = await bulkCreateProducts({
        products: [product],
        create_missing_categories: true,
      });

      if (response.total_created > 0) {
        setShowCreateProduct(false);
        setProductToCreate(null);
        // Could show success toast here
      } else {
        setError(response.results[0]?.error || 'Error al crear producto');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto');
    } finally {
      setIsCreating(false);
    }
  }, [setError]);

  // Handle category creation (placeholder - would integrate with category API)
  const handleCategoryCreate = useCallback(async (category: { name: string; description?: string }) => {
    // For now, just close the modal
    // In a full implementation, this would call the category API
    console.log('Creating category:', category);
    setShowCreateCategory(false);
  }, []);

  // Handle bulk create all new products
  const handleBulkCreateAll = useCallback(async () => {
    const productsToCreate: BulkProductItem[] = allProducts
      .filter((p) => p.is_new_product)
      .map((p, idx) => {
        const edited = editedProducts.get(idx);
        return {
          name: edited?.name || p.suggested_name || p.extracted.description,
          description: edited?.description || p.extracted.description,
          category_name: edited?.categoryName || p.extracted.suggested_category || undefined,
          unit_price: edited?.unitPrice || p.extracted.unit_price,
          cost_price: edited?.costPrice || undefined,
          min_stock_level: 5,
        };
      });

    if (productsToCreate.length === 0) {
      setError('No hay productos nuevos para crear');
      return;
    }

    setStep('creating');
    setIsCreating(true);

    try {
      const response = await bulkCreateProducts({
        products: productsToCreate,
        create_missing_categories: true,
      });

      if (response.total_failed > 0) {
        setError(`Se crearon ${response.total_created} productos. ${response.total_failed} fallaron.`);
        setStep('review');
      } else {
        // Success! Show success message and reset
        alert(`✅ ${response.total_created} producto(s) creado(s) exitosamente!`);
        reset();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear productos');
      setStep('review');
    } finally {
      setIsCreating(false);
    }
  }, [allProducts, editedProducts, setStep, setError]);

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

      case 'creating':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Creando productos...
            </h2>
            <p className="text-gray-500">
              Esto puede tomar unos momentos
            </p>
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

                  {/* Actions */}
                  <button
                    onClick={reset}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Nueva Importación
                  </button>

                  {newProductsCount > 0 && (
                    <button
                      onClick={handleBulkCreateAll}
                      disabled={isCreating}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-300"
                    >
                      Crear {newProductsCount} producto(s)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <InvoiceTabs
              extractions={state.extractionResult?.extractions || []}
              selectedIndex={activeTab}
              onSelect={handleTabChange}
              productCounts={state.extractionResult?.extractions.map((e) => e.products.length)}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Image Preview */}
              <div className="w-1/2 border-r border-gray-200 bg-gray-50 flex flex-col">
                {/* Thumbnails */}
                <ImageThumbnails
                  files={state.files}
                  selectedIndex={typeof activeTab === 'number' ? activeTab : 0}
                  onSelect={handleThumbnailClick}
                  extractionConfidences={state.extractionResult?.extractions.map(
                    (e) => e.extraction_confidence
                  )}
                />

                {/* Image Preview */}
                <div className="flex-1 flex items-center justify-center p-4">
                  {state.files.length > 0 && typeof activeTab === 'number' && state.files[activeTab] ? (
                    <img
                      src={URL.createObjectURL(state.files[activeTab])}
                      alt={`Imagen ${activeTab + 1}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
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
                        Selecciona una imagen para verla
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Products */}
              <div className="w-1/2 flex">
                {/* Products List or Consolidated View */}
                <div className={`flex-1 flex flex-col bg-white ${state.editingProduct ? 'w-1/2' : ''}`}>
                  {activeTab === 'all' ? (
                    <ConsolidatedView
                      products={displayProducts}
                      selectedIndex={state.selectedProductIndex}
                      onSelectProduct={selectProduct}
                      onEditProduct={startEditing}
                    />
                  ) : (
                    <ExtractedItemsList
                      products={displayProducts}
                      selectedIndex={state.selectedProductIndex}
                      onSelectProduct={selectProduct}
                      onEditProduct={startEditing}
                    />
                  )}
                </div>

                {/* Editor Panel */}
                {state.editingProduct && (
                  <div className="w-96 flex-shrink-0">
                    <ExtractedItemEditor
                      product={state.editingProduct}
                      categories={state.extractionResult?.detected_categories || []}
                      onSave={handleEditSave}
                      onCancel={stopEditing}
                      onCreateCategory={() => setShowCreateCategory(true)}
                    />
                  </div>
                )}
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

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateProduct}
        onClose={() => {
          setShowCreateProduct(false);
          setProductToCreate(null);
        }}
        onSubmit={handleProductCreate}
        categories={state.extractionResult?.detected_categories || []}
        initialData={productToCreate || undefined}
        isLoading={isCreating}
      />

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={showCreateCategory}
        onClose={() => setShowCreateCategory(false)}
        onSubmit={handleCategoryCreate}
        isLoading={isCreating}
      />
    </div>
  );
}
