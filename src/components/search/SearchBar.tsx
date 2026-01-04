import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { SearchResults } from './SearchResults';
import { useProductSearch } from '../../hooks/useProductSearch';
import type { Product } from '../../types/product';

interface SearchBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Callback when a product is selected */
  onProductSelect?: (product: Product) => void;
  /** Auto-focus on mount */
  autoFocus?: boolean;
}

/**
 * Google-like search bar with product search functionality.
 * Features:
 * - Debounced search (300ms)
 * - Loading spinner
 * - Clear button
 * - Keyboard navigation (Escape to close)
 * - Click outside to close
 */
export function SearchBar({
  placeholder = 'Buscar productos...',
  onProductSelect,
  autoFocus = false,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the product search hook
  const { 
    data: products, 
    isLoading, 
    isFetching,
    isError,
    debouncedTerm,
  } = useProductSearch(searchTerm);

  // Open results when we have a search term
  useEffect(() => {
    if (debouncedTerm) {
      setIsOpen(true);
      setSelectedIndex(-1);
    }
  }, [debouncedTerm]);

  // Scroll selected item into view when navigating with keyboard
  useEffect(() => {
    if (selectedIndex >= 0) {
      const selectedEl = containerRef.current?.querySelector('[aria-selected="true"]');
      selectedEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClear = useCallback(() => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Handle product selection
  const handleProductClick = useCallback((product: Product) => {
    onProductSelect?.(product);
    setIsOpen(false);
  }, [onProductSelect]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        } else {
          handleClear();
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (isOpen && products.length > 0) {
          setSelectedIndex(prev => 
            prev < products.length - 1 ? prev + 1 : 0
          );
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen && products.length > 0) {
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : products.length - 1
          );
        }
        break;
        
      case 'Enter':
        e.preventDefault();
        if (isOpen && selectedIndex >= 0 && products[selectedIndex]) {
          handleProductClick(products[selectedIndex]);
        }
        break;
    }
  };

  // Show loading spinner when fetching
  const showSpinner = isFetching && searchTerm.trim().length > 0;
  // Show clear button when there's text
  const showClearButton = searchTerm.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search Input Container */}
      <div 
        className={`
          flex items-center gap-3 px-4 py-3
          bg-[var(--color-bg)] rounded-full
          border border-[var(--color-border)]
          search-shadow
          transition-shadow duration-200
          focus-within:border-[var(--color-primary)]
        `}
      >
        {/* Search Icon */}
        <Search 
          size={20} 
          className="flex-shrink-0 text-[var(--color-text-secondary)]" 
          aria-hidden="true"
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => debouncedTerm && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          aria-label="Buscar productos"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          className={`
            flex-1 bg-transparent border-none outline-none
            text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]
            text-lg
          `}
        />

        {/* Loading Spinner */}
        {showSpinner && (
          <Loader2 
            size={20} 
            className="flex-shrink-0 text-[var(--color-primary)] animate-spin" 
            aria-label="Buscando"
          />
        )}

        {/* Clear Button */}
        {showClearButton && !showSpinner && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            className={`
              flex-shrink-0 p-1 rounded-full
              text-[var(--color-text-secondary)]
              hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              transition-colors duration-150
            `}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <SearchResults
          products={products}
          isLoading={isLoading}
          isError={isError}
          searchTerm={debouncedTerm}
          onProductClick={handleProductClick}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
}

export default SearchBar;

