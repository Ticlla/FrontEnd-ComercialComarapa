import { Logo } from '../components/ui/Logo';
import { SearchBar } from '../components/search';
import type { Product } from '../types/product';

/**
 * Main search page with Google-like centered layout.
 * This is the primary interface for store staff to search products.
 */
export function SearchPage() {
  const handleProductSelect = (product: Product) => {
    // Future: Navigate to product detail or open modal
    console.log('Product selected:', product);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
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
    </div>
  );
}

export default SearchPage;

