/**
 * Tab navigation for invoices (Todos + individual invoices).
 */

import type { ExtractionResult } from '../../types/import';

// =============================================================================
// TYPES
// =============================================================================

interface InvoiceTabsProps {
  extractions: ExtractionResult[];
  selectedIndex: number | 'all';
  onSelect: (index: number | 'all') => void;
  productCounts?: number[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export function InvoiceTabs({
  extractions,
  selectedIndex,
  onSelect,
  productCounts = [],
}: InvoiceTabsProps) {
  const totalProducts = productCounts.reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex border-b border-gray-200 bg-white">
      {/* All Products Tab */}
      <button
        onClick={() => onSelect('all')}
        className={`
          px-4 py-3 text-sm font-medium border-b-2 transition-colors
          ${selectedIndex === 'all'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }
        `}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          Todos
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
            {totalProducts}
          </span>
        </span>
      </button>

      {/* Divider */}
      <div className="w-px bg-gray-200 my-2" />

      {/* Individual Invoice Tabs */}
      {extractions.map((extraction, index) => {
        const isSelected = selectedIndex === index;
        const productCount = productCounts[index] || extraction.products.length;
        const invoiceLabel = extraction.invoice.invoice_number
          ? `#${extraction.invoice.invoice_number}`
          : `Nota ${index + 1}`;

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`
              px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${isSelected
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="flex items-center gap-2">
              {invoiceLabel}
              <span
                className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}
                `}
              >
                {productCount}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}






