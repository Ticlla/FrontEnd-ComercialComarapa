/**
 * Single extracted product item with match status.
 */

import type { MatchedProduct } from '../../types/import';
import { getConfidenceColor, formatConfidence, needsReview } from '../../types/import';

// =============================================================================
// TYPES
// =============================================================================

interface ExtractedItemProps {
  product: MatchedProduct;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ExtractedItem({
  product,
  index,
  isSelected,
  onClick,
  onEdit,
}: ExtractedItemProps) {
  const { extracted, matches, is_new_product, suggested_name } = product;
  const topMatch = matches[0];
  const requiresReview = needsReview(product);

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 transition-all cursor-pointer
        ${isSelected
          ? 'border-indigo-500 bg-indigo-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        {/* Index & Description */}
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium flex items-center justify-center">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {suggested_name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {extracted.description}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
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
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(topMatch.confidence)}`}>
              {topMatch.confidence === 'high' && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {formatConfidence(topMatch.similarity_score)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Details Row */}
      <div className="flex items-center justify-between text-sm">
        {/* Quantity & Price */}
        <div className="flex items-center gap-4 text-gray-600">
          <span>
            <span className="font-medium">{extracted.quantity}</span> unid.
          </span>
          <span>
            Bs. <span className="font-medium">{extracted.unit_price.toFixed(2)}</span>
          </span>
          {extracted.suggested_category && (
            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
              {extracted.suggested_category}
            </span>
          )}
        </div>

        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className={`
            px-3 py-1 rounded-lg text-xs font-medium transition-colors
            ${requiresReview
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {requiresReview ? 'Revisar' : 'Editar'}
        </button>
      </div>

      {/* Match Info (if matched) */}
      {topMatch && !is_new_product && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Coincide con:{' '}
            <span className="font-medium text-gray-700">
              {topMatch.existing_product_name}
            </span>
            <span className="text-gray-400 ml-1">
              ({topMatch.existing_product_sku})
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

