/**
 * Inline editor panel for correcting extracted product data.
 */

import { useState, useCallback } from 'react';
import type { MatchedProduct, AutocompleteSuggestion, DetectedCategory } from '../../types/import';
import { AIAutocomplete } from './AIAutocomplete';
import { toEditableProduct } from '../../hooks/useImportState';

// =============================================================================
// TYPES
// =============================================================================

interface ExtractedItemEditorProps {
  product: MatchedProduct;
  categories: DetectedCategory[];
  onSave: (edited: EditedProductData) => void;
  onCancel: () => void;
  onCreateCategory: () => void;
}

export interface EditedProductData {
  name: string;
  description: string;
  categoryId: string | null;
  categoryName: string | null;
  unitPrice: number;
  costPrice: number | null;
  shouldCreate: boolean;
  linkedProductId: string | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ExtractedItemEditor({
  product,
  categories,
  onSave,
  onCancel,
  onCreateCategory,
}: ExtractedItemEditorProps) {
  const editable = toEditableProduct(product);

  const [name, setName] = useState(editable.editedName || '');
  const [description, setDescription] = useState(editable.editedDescription);
  const [categoryId, setCategoryId] = useState<string | null>(editable.editedCategoryId);
  const [categoryName, setCategoryName] = useState<string | null>(editable.editedCategoryName);
  const [unitPrice, setUnitPrice] = useState(editable.editedUnitPrice);
  const [costPrice, setCostPrice] = useState<number | null>(editable.editedCostPrice);
  const [shouldCreate, setShouldCreate] = useState(editable.shouldCreate);
  const [linkedProductId, setLinkedProductId] = useState<string | null>(editable.linkedProductId);

  // Handle autocomplete suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: AutocompleteSuggestion) => {
    setDescription(suggestion.description);
    if (suggestion.category) {
      const existingCat = categories.find(
        (c) => c.name.toLowerCase() === suggestion.category?.toLowerCase()
      );
      if (existingCat && existingCat.existing_category_id) {
        setCategoryId(existingCat.existing_category_id);
        setCategoryName(existingCat.name);
      } else {
        setCategoryId(null);
        setCategoryName(suggestion.category);
      }
    }
  }, [categories]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      onCreateCategory();
    } else if (value) {
      const cat = categories.find((c) => c.existing_category_id === value);
      setCategoryId(value);
      setCategoryName(cat?.name || null);
    } else {
      setCategoryId(null);
      setCategoryName(null);
    }
  };

  // Handle link to existing product
  const handleLinkProduct = (productId: string | null) => {
    setLinkedProductId(productId);
    setShouldCreate(!productId);
  };

  // Handle save
  const handleSave = () => {
    onSave({
      name,
      description,
      categoryId,
      categoryName,
      unitPrice,
      costPrice,
      shouldCreate,
      linkedProductId,
    });
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Editar Producto</h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Original Text */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Texto original extraído:</p>
          <p className="text-sm text-gray-700 italic">"{product.extracted.description}"</p>
        </div>

        {/* Name with AI Autocomplete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del producto
          </label>
          <AIAutocomplete
            value={name}
            onChange={setName}
            onSelectSuggestion={handleSuggestionSelect}
            context={product.extracted.suggested_category || undefined}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={categoryId || ''}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Sin categoría</option>
            {categories.filter((c) => c.exists_in_catalog).map((cat) => (
              <option key={cat.existing_category_id} value={cat.existing_category_id || ''}>
                {cat.name}
              </option>
            ))}
            <option value="new">+ Crear nueva categoría</option>
          </select>
          {categoryName && !categoryId && (
            <p className="mt-1 text-xs text-amber-600">
              Se creará nueva categoría: "{categoryName}"
            </p>
          )}
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio de venta (Bs.)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio de costo (Bs.)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={costPrice || ''}
              onChange={(e) => setCostPrice(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Opcional"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        {/* Link to Existing Product */}
        {product.matches.length > 0 && (
          <div className="border-t pt-5 mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Vincular a producto existente?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="linkOption"
                  checked={linkedProductId === null}
                  onChange={() => handleLinkProduct(null)}
                  className="text-indigo-500"
                />
                <span className="text-sm">Crear como nuevo producto</span>
              </label>

              {product.matches.slice(0, 3).map((match) => (
                <label
                  key={match.existing_product_id}
                  className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="linkOption"
                    checked={linkedProductId === match.existing_product_id}
                    onChange={() => handleLinkProduct(match.existing_product_id)}
                    className="text-indigo-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{match.existing_product_name}</p>
                    <p className="text-xs text-gray-500">{match.existing_product_sku}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {Math.round(match.similarity_score * 100)}%
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}






