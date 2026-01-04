/**
 * Formatting utility functions.
 */

/**
 * Format price in Bolivianos (Bs.)
 * Handles both string and number inputs, with NaN protection.
 * 
 * @param price - Price as string or number
 * @returns Formatted price string (e.g., "Bs. 25.00")
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return 'Bs. 0.00';
  return `Bs. ${numPrice.toFixed(2)}`;
}

/**
 * Parse a price string or number to a number.
 * Returns 0 if invalid.
 * 
 * @param price - Price as string or number
 * @returns Parsed number
 */
export function parsePrice(price: string | number | null): number {
  if (price === null) return 0;
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? 0 : numPrice;
}

