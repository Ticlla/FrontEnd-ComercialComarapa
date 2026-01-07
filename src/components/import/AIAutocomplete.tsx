/**
 * AI-powered autocomplete dropdown for product names.
 */

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { getAutocompleteSuggestions } from '../../services/import';
import type { AutocompleteSuggestion } from '../../types/import';

// =============================================================================
// TYPES
// =============================================================================

interface AIAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion: (suggestion: AutocompleteSuggestion) => void;
  placeholder?: string;
  context?: string;
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AIAutocomplete({
  value,
  onChange,
  onSelectSuggestion,
  placeholder = 'Nombre del producto...',
  context,
  disabled = false,
}: AIAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedValue = useDebounce(value, 300);

  // Fetch suggestions when debounced value changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getAutocompleteSuggestions({
          partialText: debouncedValue,
          context: context || undefined,
        });
        setSuggestions(response.suggestions);
        setIsOpen(response.suggestions.length > 0);
        setSelectedIndex(-1);
      } catch {
        setError('Error al obtener sugerencias');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue, context]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: AutocompleteSuggestion) => {
    onChange(suggestion.name);
    onSelectSuggestion(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative">
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2 pr-10 rounded-lg border transition-colors
            ${disabled
              ? 'bg-gray-100 border-gray-200 text-gray-500'
              : 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
            }
          `}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {/* AI Badge */}
        {!isLoading && value.length >= 2 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-xs text-indigo-500 font-medium">IA</span>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.name}-${index}`}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`
                px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0
                ${index === selectedIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'}
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {suggestion.name}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {suggestion.description}
                  </p>
                </div>
                {suggestion.category && (
                  <span className="flex-shrink-0 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                    {suggestion.category}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

