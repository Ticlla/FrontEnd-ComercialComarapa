/**
 * Consolidated view table showing all products from all invoices.
 */

import type { MatchedProduct } from '../../types/import';
import { getConfidenceColor, formatConfidence } from '../../types/import';

// =============================================================================
// TYPES
// =============================================================================

interface ConsolidatedViewProps {
  products: MatchedProduct[];
  onSelectProduct: (index: number) => void;
  onEditProduct: (product: MatchedProduct) => void;
  selectedIndex: number | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ConsolidatedView({
  products,
  onSelectProduct,
  onEditProduct,
  selectedIndex,
}: ConsolidatedViewProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-sm">No hay productos extraídos</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">#</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Producto</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Categoría</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Cant.</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">P. Unit.</th>
            <th className="px-4 py-3 text-center font-medium text-gray-500">Estado</th>
            <th className="px-4 py-3 text-center font-medium text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product, index) => {
            const { extracted, matches, is_new_product, suggested_name } = product;
            const topMatch = matches[0];
            const isSelected = selectedIndex === index;

            return (
              <tr
                key={index}
                onClick={() => onSelectProduct(index)}
                className={`
                  cursor-pointer transition-colors
                  ${isSelected
                    ? 'bg-indigo-50'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                {/* Index */}
                <td className="px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium inline-flex items-center justify-center">
                    {index + 1}
                  </span>
                </td>

                {/* Product Name */}
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{suggested_name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {extracted.description}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  {extracted.suggested_category ? (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {extracted.suggested_category}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Quantity */}
                <td className="px-4 py-3 text-right font-medium">
                  {extracted.quantity}
                </td>

                {/* Unit Price */}
                <td className="px-4 py-3 text-right">
                  Bs. {extracted.unit_price.toFixed(2)}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  {is_new_product ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Nuevo
                    </span>
                  ) : topMatch ? (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(topMatch.confidence)}`}>
                      {formatConfidence(topMatch.similarity_score)}
                    </span>
                  ) : null}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct(product);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

