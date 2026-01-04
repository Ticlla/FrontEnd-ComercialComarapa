import { Check, AlertTriangle, X } from 'lucide-react';
import { getStockStatus, type StockStatus } from '../../types/product';

interface StockIndicatorProps {
  currentStock: number;
  minStockLevel: number;
  showCount?: boolean;
}

const statusConfig: Record<StockStatus, {
  icon: typeof Check;
  label: string;
  className: string;
}> = {
  in_stock: {
    icon: Check,
    label: 'En stock',
    className: 'text-[var(--color-success)]',
  },
  low_stock: {
    icon: AlertTriangle,
    label: 'Stock bajo',
    className: 'text-[var(--color-warning)]',
  },
  out_of_stock: {
    icon: X,
    label: 'Sin stock',
    className: 'text-[var(--color-danger)]',
  },
};

/**
 * Visual indicator for product stock status.
 * Shows icon + count with color coding:
 * - Green (✓): In stock (above minimum)
 * - Yellow (⚠): Low stock (at or below minimum)
 * - Red (✗): Out of stock (zero)
 */
export function StockIndicator({ 
  currentStock, 
  minStockLevel,
  showCount = true,
}: StockIndicatorProps) {
  const status = getStockStatus(currentStock, minStockLevel);
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span 
      className={`inline-flex items-center gap-1 text-sm font-medium ${config.className}`}
      title={config.label}
    >
      <Icon size={16} aria-hidden="true" />
      {showCount && (
        <span>
          {currentStock} {currentStock === 1 ? 'unid' : 'unid'}
        </span>
      )}
      <span className="sr-only">{config.label}</span>
    </span>
  );
}

export default StockIndicator;



