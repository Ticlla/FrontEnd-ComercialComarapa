import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';

describe('useModal', () => {
  it('starts closed by default', () => {
    const { result } = renderHook(() => useModal());
    
    expect(result.current.isOpen).toBe(false);
  });

  it('can start open with initialState', () => {
    const { result } = renderHook(() => useModal(true));
    
    expect(result.current.isOpen).toBe(true);
  });

  it('opens modal with open()', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('closes modal with close()', () => {
    const { result } = renderHook(() => useModal(true));
    
    act(() => {
      result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('toggles modal state with toggle()', () => {
    const { result } = renderHook(() => useModal());
    
    // Toggle open
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Toggle closed
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('returns stable function references', () => {
    const { result, rerender } = renderHook(() => useModal());
    
    const { open: open1, close: close1, toggle: toggle1 } = result.current;
    
    rerender();
    
    const { open: open2, close: close2, toggle: toggle2 } = result.current;
    
    expect(open1).toBe(open2);
    expect(close1).toBe(close2);
    expect(toggle1).toBe(toggle2);
  });
});




