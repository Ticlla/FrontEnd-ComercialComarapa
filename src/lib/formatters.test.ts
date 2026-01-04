import { describe, it, expect } from 'vitest';
import { formatPrice, parsePrice, calculateMargin } from './formatters';

describe('formatPrice', () => {
  it('formats number price correctly', () => {
    expect(formatPrice(25)).toBe('Bs. 25.00');
    expect(formatPrice(10.5)).toBe('Bs. 10.50');
    expect(formatPrice(0)).toBe('Bs. 0.00');
  });

  it('formats string price correctly', () => {
    expect(formatPrice('25.00')).toBe('Bs. 25.00');
    expect(formatPrice('10.5')).toBe('Bs. 10.50');
    expect(formatPrice('0')).toBe('Bs. 0.00');
  });

  it('handles NaN values gracefully', () => {
    expect(formatPrice('invalid')).toBe('Bs. 0.00');
    expect(formatPrice('')).toBe('Bs. 0.00');
    expect(formatPrice(NaN)).toBe('Bs. 0.00');
  });
});

describe('parsePrice', () => {
  it('parses number correctly', () => {
    expect(parsePrice(25)).toBe(25);
    expect(parsePrice(10.5)).toBe(10.5);
    expect(parsePrice(0)).toBe(0);
  });

  it('parses string correctly', () => {
    expect(parsePrice('25.00')).toBe(25);
    expect(parsePrice('10.5')).toBe(10.5);
  });

  it('returns 0 for null/undefined', () => {
    expect(parsePrice(null)).toBe(0);
    expect(parsePrice(undefined)).toBe(0);
  });

  it('returns 0 for invalid values', () => {
    expect(parsePrice('invalid')).toBe(0);
    expect(parsePrice('')).toBe(0);
  });
});

describe('calculateMargin', () => {
  it('calculates margin correctly', () => {
    // Margin = (unit - cost) / unit * 100
    expect(calculateMargin(100, 80)).toBe(20); // 20% margin
    expect(calculateMargin(100, 50)).toBe(50); // 50% margin
    expect(calculateMargin('100', '75')).toBe(25); // 25% margin with strings
  });

  it('handles negative margin (cost > price)', () => {
    const margin = calculateMargin(80, 100);
    expect(margin).toBe(-25); // -25% (losing money)
  });

  it('returns null when cost is null', () => {
    expect(calculateMargin(100, null)).toBeNull();
  });

  it('returns null when unit price is zero or negative', () => {
    expect(calculateMargin(0, 50)).toBeNull();
    expect(calculateMargin(-10, 50)).toBeNull();
  });

  it('handles zero cost price', () => {
    expect(calculateMargin(100, 0)).toBe(100); // 100% margin
  });
});



