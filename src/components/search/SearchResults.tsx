import { SearchResultItem } from './SearchResultItem';
import { Loader2, SearchX } from 'lucide-react';
import type { Product } from '../../types/product';

interface SearchResultsProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onProductClick?: (product: Product) => void;
  selectedIndex?: number;
}

/**
 * Search results dropdown container.
 * Handles loading, error, empty, and results states.
 */
export function SearchResults({
  products,
  isLoading,
  isError,
  searchTerm,
  onProductClick,
  selectedIndex = -1,
}: SearchResultsProps) {
  // Don't show anything if no search term
  if (!searchTerm.trim()) {
    return null;
  }

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-bg)] rounded-lg search-shadow border border-[var(--color-border)] overflow-hidden z-50"
      role="listbox"
      aria-label="Resultados de búsqueda"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-8 text-[var(--color-text-secondary)]">
          <Loader2 size={20} className="animate-spin" />
          <span>Buscando...</span>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-[var(--color-danger)]">
          <SearchX size={32} />
          <span>Error al buscar. Intenta de nuevo.</span>
        </div>
      )}

      {/* Empty Results */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-[var(--color-text-secondary)]">
          <SearchX size={32} />
          <span>No se encontraron productos para "{searchTerm}"</span>
        </div>
      )}

      {/* Results List */}
      {!isLoading && !isError && products.length > 0 && (
        <>
          <div className="max-h-96 overflow-y-auto">
            {products.map((product, index) => (
              <SearchResultItem
                key={product.id}
                product={product}
                onClick={onProductClick}
                isSelected={index === selectedIndex}
              />
            ))}
          </div>
          
          {/* Results Count */}
          <div className="px-4 py-2 text-xs text-center text-[var(--color-text-secondary)] border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            Mostrando {products.length} resultado{products.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchResults;



