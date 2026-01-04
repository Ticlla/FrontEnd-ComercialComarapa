import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, calculateMargin } from '../../lib/formatters';
import type { Product } from '../../types/product';

interface ProductPricingProps {
  product: Product;
}

/**
 * Get margin display configuration based on value.
 */
function getMarginConfig(margin: number) {
  if (margin < 0) {
    return {
      icon: TrendingDown,
      colorClass: 'text-[var(--color-danger)]',
      label: 'Loss',
    };
  }
  if (margin >= 20) {
    return {
      icon: TrendingUp,
      colorClass: 'text-[var(--color-success)]',
      label: 'Margin',
    };
  }
  return {
    icon: TrendingUp,
    colorClass: 'text-[var(--color-warning)]',
    label: 'Margin',
  };
}

/**
 * Displays product pricing: unit price, cost price, and profit margin.
 */
export function ProductPricing({ product }: ProductPricingProps) {
  const margin = calculateMargin(product.unit_price, product.cost_price);
  const marginConfig = margin !== null ? getMarginConfig(margin) : null;

  return (
    <div className="py-4 border-t border-b border-[var(--color-border)]">
      {/* Main Price */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-[var(--color-text)]">
          {formatPrice(product.unit_price)}
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">
          Unit Price
        </div>
      </div>

      {/* Cost and Margin */}
      <div className="flex justify-center gap-8">
        {/* Cost Price */}
        {product.cost_price && (
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-[var(--color-text-secondary)]" />
            <div>
              <div className="text-sm font-medium text-[var(--color-text)]">
                {formatPrice(product.cost_price)}
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                Cost
              </div>
            </div>
          </div>
        )}

        {/* Profit Margin */}
        {margin !== null && marginConfig && (
          <div className="flex items-center gap-2">
            <marginConfig.icon size={16} className={marginConfig.colorClass} />
            <div>
              <div className={`text-sm font-medium ${marginConfig.colorClass}`}>
                {margin.toFixed(1)}%
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                {marginConfig.label}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPricing;
