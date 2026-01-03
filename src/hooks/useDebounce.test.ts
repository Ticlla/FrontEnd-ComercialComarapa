import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    // Initial value
    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated' });

    // Value should not change yet
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now it should be updated
    expect(result.current).toBe('updated');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    // Rapid changes
    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(100));
    
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(100));
    
    rerender({ value: 'abcd' });
    act(() => vi.advanceTimersByTime(100));

    // Still showing initial value (timer keeps resetting)
    expect(result.current).toBe('a');

    // Wait full delay
    act(() => vi.advanceTimersByTime(300));

    // Now shows final value
    expect(result.current).toBe('abcd');
  });

  it('uses custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // Not updated at 300ms
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('initial');

    // Updated at 500ms
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('updated');
  });

  it('works with different types', () => {
    // Number
    const { result: numResult } = renderHook(() => useDebounce(42, 300));
    expect(numResult.current).toBe(42);

    // Object
    const obj = { name: 'test' };
    const { result: objResult } = renderHook(() => useDebounce(obj, 300));
    expect(objResult.current).toEqual({ name: 'test' });

    // Null
    const { result: nullResult } = renderHook(() => useDebounce(null, 300));
    expect(nullResult.current).toBeNull();
  });

  it('uses default delay of 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('initial');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('updated');
  });
});

