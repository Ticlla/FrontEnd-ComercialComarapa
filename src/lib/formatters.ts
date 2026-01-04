/**
 * Shared formatting utilities.
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
  
  if (isNaN(numPrice)) {
    return 'Bs. 0.00';
  }
  
  return `Bs. ${numPrice.toFixed(2)}`;
}

/**
 * Parse a price value to number.
 * Returns 0 for invalid values.
 * 
 * @param price - Price as string or number
 * @returns Parsed number or 0 if invalid
 */
export function parsePrice(price: string | number | null | undefined): number {
  if (price === null || price === undefined) return 0;
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return isNaN(numPrice) ? 0 : numPrice;
}

/**
 * Calculate profit margin percentage.
 * Returns null if calculation is not possible.
 * 
 * @param unitPrice - Selling price
 * @param costPrice - Cost price (can be null)
 * @returns Margin percentage or null
 */
export function calculateMargin(
  unitPrice: string | number,
  costPrice: string | number | null
): number | null {
  if (costPrice === null) return null;
  
  const unit = parsePrice(unitPrice);
  const cost = parsePrice(costPrice);
  
  // Can't calculate margin if unit price is zero or negative
  if (unit <= 0) return null;
  
  return ((unit - cost) / unit) * 100;
}



