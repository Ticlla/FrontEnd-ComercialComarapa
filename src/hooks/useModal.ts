import { useState, useCallback } from 'react';

/**
 * Return type for useModal hook.
 */
export interface UseModalReturn {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Open the modal */
  open: () => void;
  /** Close the modal */
  close: () => void;
  /** Toggle the modal */
  toggle: () => void;
}

/**
 * Hook for managing modal open/close state.
 * 
 * @param initialState - Initial open state (default: false)
 * @returns Modal state and control functions
 * 
 * @example
 * ```tsx
 * const { isOpen, open, close } = useModal();
 * 
 * return (
 *   <>
 *     <button onClick={open}>Open Modal</button>
 *     <Modal isOpen={isOpen} onClose={close}>
 *       Content here
 *     </Modal>
 *   </>
 * );
 * ```
 */
export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

export default useModal;


