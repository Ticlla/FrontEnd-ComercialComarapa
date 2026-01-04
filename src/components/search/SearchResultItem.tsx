import { Package } from 'lucide-react';
import { StockIndicator } from './StockIndicator';
import { formatPrice } from '../../lib/formatters';
import type { Product } from '../../types/product';

interface SearchResultItemProps {
  product: Product;
  onClick?: (product: Product) => void;
  isSelected?: boolean;
}

/**
 * Individual product row in search results.
 * Shows: icon, name, SKU, price, stock indicator
 */
export function SearchResultItem({ 
  product, 
  onClick,
  isSelected = false,
}: SearchResultItemProps) {
  const handleClick = () => {
    onClick?.(product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(product);
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-index={isSelected ? 'selected' : undefined}
      className={`
        flex items-center gap-3 px-4 py-3 cursor-pointer
        transition-colors duration-150
        hover:bg-[var(--color-bg-secondary)]
        focus:bg-[var(--color-bg-secondary)] focus:outline-none
        ${isSelected ? 'bg-[var(--color-bg-secondary)]' : ''}
        ${product.current_stock === 0 ? 'opacity-60' : ''}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 text-[var(--color-text-secondary)]">
        <Package size={24} aria-hidden="true" />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {/* Product Name & Relevance Badge */}
        <div className="flex items-center gap-2">
          <div className="font-medium text-[var(--color-text)] truncate">
            {product.name}
          </div>
          {product.relevance !== undefined && product.relevance < 0.4 && (
            <span 
              className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
              title="Resultado aproximado (posible error tipográfico)"
            >
              Sugerencia
            </span>
          )}
        </div>
        
        {/* SKU, Price, Category */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span className="font-mono">{product.sku}</span>
          <span className="text-[var(--color-border)]">|</span>
          <span className="font-medium text-[var(--color-text)]">
            {formatPrice(product.unit_price)}
          </span>
          {product.category && (
            <>
              <span className="text-[var(--color-border)]">|</span>
              <span className="truncate">{product.category.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Stock Indicator */}
      <div className="flex-shrink-0">
        <StockIndicator 
          currentStock={product.current_stock}
          minStockLevel={product.min_stock_level}
        />
      </div>
    </div>
  );
}

export default SearchResultItem;

