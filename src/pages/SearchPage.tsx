import { useState, useCallback, useRef, useEffect } from 'react';
import { Logo } from '../components/ui/Logo';
import { SearchBar } from '../components/search';
import { ProductDetailModal } from '../components/product';
import type { Product } from '../types/product';

/**
 * Main search page with Google-like centered layout.
 * This is the primary interface for store staff to search products.
 */
export function SearchPage() {
  // Modal state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Ref for cleanup timeout
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Handle product selection from search
  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // Clear product ID after modal close animation completes
    closeTimeoutRef.current = setTimeout(() => {
      setSelectedProductId(null);
    }, 200);
  }, []);

  return (
    <div className="h-full bg-[var(--color-bg)] flex flex-col">
      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" />
        </div>

        {/* Search Bar */}
        <SearchBar 
          placeholder="Buscar productos por nombre o SKU..."
          onProductSelect={handleProductSelect}
          autoFocus
        />

        {/* Helper Text */}
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Buscar por nombre o código SKU
        </p>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[var(--color-text-secondary)]">
        <p>Comercial Comarapa © {new Date().getFullYear()}</p>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        productId={selectedProductId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default SearchPage;
