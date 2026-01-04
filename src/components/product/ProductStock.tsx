import { Package, AlertTriangle, XCircle } from 'lucide-react';
import type { Product } from '../../types/product';
import { getStockStatus, type StockStatus } from '../../types/product';

interface ProductStockProps {
  product: Product;
}

/**
 * Get stock status configuration (color, icon, message).
 */
function getStatusConfig(status: StockStatus) {
  switch (status) {
    case 'in_stock':
      return {
        color: 'text-[var(--color-success)]',
        bgColor: 'bg-[var(--color-success)]/10',
        icon: Package,
        message: 'In Stock',
      };
    case 'low_stock':
      return {
        color: 'text-[var(--color-warning)]',
        bgColor: 'bg-[var(--color-warning)]/10',
        icon: AlertTriangle,
        message: 'Low Stock - Reorder Soon',
      };
    case 'out_of_stock':
      return {
        color: 'text-[var(--color-danger)]',
        bgColor: 'bg-[var(--color-danger)]/10',
        icon: XCircle,
        message: 'Out of Stock',
      };
  }
}

/**
 * Displays product stock information with status indicator.
 */
export function ProductStock({ product }: ProductStockProps) {
  const status = getStockStatus(product.current_stock, product.min_stock_level);
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="pt-4">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.color} mb-3`}>
        <Icon size={16} />
        <span className="text-sm font-medium">{config.message}</span>
      </div>

      {/* Stock Details */}
      <div className="flex gap-8">
        {/* Current Stock */}
        <div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {product.current_stock}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)]">
            Units in Stock
          </div>
        </div>

        {/* Min Level */}
        <div>
          <div className="text-2xl font-bold text-[var(--color-text-secondary)]">
            {product.min_stock_level}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)]">
            Min Level
          </div>
        </div>

        {/* Units to Reorder (if low/out of stock) */}
        {status !== 'in_stock' && (
          <div>
            <div className="text-2xl font-bold text-[var(--color-danger)]">
              {Math.max(0, product.min_stock_level - product.current_stock + 1)}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Units Needed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductStock;



