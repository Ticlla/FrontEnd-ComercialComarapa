import { Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ProductInfo } from './ProductInfo';
import { ProductPricing } from './ProductPricing';
import { ProductStock } from './ProductStock';
import { useProduct } from '../../hooks/useProduct';

interface ProductDetailModalProps {
  /** Product ID to display, or null if no product selected */
  productId: string | null;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * Modal displaying full product details.
 * 
 * Features:
 * - Fetches product data by ID
 * - Shows loading/error states
 * - Displays product info, pricing, and stock
 */
export function ProductDetailModal({
  productId,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const { data: product, isLoading, isError, error } = useProduct(productId);

  // Determine modal title based on state
  const getTitle = () => {
    if (isLoading) return 'Loading...';
    if (isError) return 'Error';
    if (product) return product.name;
    return 'Product Details';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="md"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-[var(--color-primary)] mb-3" />
          <span className="text-[var(--color-text-secondary)]">Loading product...</span>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-[var(--color-danger)]">
          <AlertCircle size={32} className="mb-3" />
          <span className="font-medium mb-1">Error loading product</span>
          <span className="text-sm text-[var(--color-text-secondary)]">
            {error?.message || 'Please try again'}
          </span>
        </div>
      )}

      {/* Product Content */}
      {product && !isLoading && !isError && (
        <div className="space-y-4">
          {/* Product Info (SKU, Category, Description) */}
          <ProductInfo product={product} />

          {/* Pricing (Unit Price, Cost, Margin) */}
          <ProductPricing product={product} />

          {/* Stock Information */}
          <ProductStock product={product} />
        </div>
      )}
    </Modal>
  );
}

export default ProductDetailModal;
