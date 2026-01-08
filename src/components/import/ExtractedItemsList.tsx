/**
 * List of extracted products with summary stats.
 */

import type { MatchedProduct } from '../../types/import';
import { ExtractedItem } from './ExtractedItem';

// =============================================================================
// TYPES
// =============================================================================

interface ExtractedItemsListProps {
  products: MatchedProduct[];
  selectedIndex: number | null;
  onSelectProduct: (index: number | null) => void;
  onEditProduct: (product: MatchedProduct) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ExtractedItemsList({
  products,
  selectedIndex,
  onSelectProduct,
  onEditProduct,
}: ExtractedItemsListProps) {
  const newProductsCount = products.filter((p) => p.is_new_product).length;
  const matchedCount = products.length - newProductsCount;

  return (
    <div className="flex flex-col h-full">
      {/* Header with Stats */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">
            Productos Extraídos
          </h3>
          <span className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600">
              {matchedCount} coincidencias
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-600">
              {newProductsCount} nuevos
            </span>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron productos en esta imagen
          </div>
        ) : (
          products.map((product, index) => (
            <ExtractedItem
              key={index}
              product={product}
              index={index}
              isSelected={selectedIndex === index}
              onClick={() => onSelectProduct(index)}
              onEdit={() => onEditProduct(product)}
            />
          ))
        )}
      </div>

      {/* Actions Footer */}
      {products.length > 0 && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                // TODO: Implement select all for creation
              }}
            >
              Seleccionar Nuevos ({newProductsCount})
            </button>
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => {
                // TODO: Implement create selected
              }}
            >
              Crear Productos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




