import { Tag, FileText } from 'lucide-react';
import type { Product } from '../../types/product';

interface ProductInfoProps {
  product: Product;
}

/**
 * Displays product info: SKU, category, and description.
 */
export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-3">
      {/* SKU and Category badges */}
      <div className="flex flex-wrap items-center gap-2">
        {/* SKU Badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
          <Tag size={12} />
          {product.sku}
        </span>

        {/* Category Badge */}
        {product.category && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
          <FileText size={16} className="flex-shrink-0 mt-0.5" />
          <p>{product.description}</p>
        </div>
      )}
    </div>
  );
}

export default ProductInfo;

