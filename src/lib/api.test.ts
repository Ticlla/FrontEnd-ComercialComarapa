import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './api';
import { AxiosError } from 'axios';

// Helper to create mock AxiosError
function createAxiosError(
  status: number,
  data: Record<string, unknown>,
  code?: string
): AxiosError {
  const error = new Error('Test error') as AxiosError;
  error.isAxiosError = true;
  error.response = {
    status,
    statusText: 'Error',
    headers: {},
    config: {} as any,
    data,
  };
  error.code = code;
  error.config = {} as any;
  return error;
}

describe('getErrorMessage', () => {
  describe('with string error', () => {
    it('returns error field from response', () => {
      const error = createAxiosError(400, { error: 'Bad request' });
      expect(getErrorMessage(error)).toBe('Bad request');
    });
  });

  describe('with FastAPI validation errors', () => {
    it('handles string detail', () => {
      const error = createAxiosError(422, { detail: 'Validation failed' });
      expect(getErrorMessage(error)).toBe('Validation failed');
    });

    it('handles array detail (FastAPI format)', () => {
      const error = createAxiosError(422, {
        detail: [
          {
            loc: ['query', 'q'],
            msg: 'field required',
            type: 'value_error.missing',
          },
        ],
      });
      expect(getErrorMessage(error)).toBe('q: field required');
    });

    it('handles multiple validation errors (returns first)', () => {
      const error = createAxiosError(422, {
        detail: [
          { loc: ['body', 'name'], msg: 'field required', type: 'value_error' },
          { loc: ['body', 'price'], msg: 'must be positive', type: 'value_error' },
        ],
      });
      expect(getErrorMessage(error)).toBe('name: field required');
    });

    it('handles nested loc path', () => {
      const error = createAxiosError(422, {
        detail: [
          { loc: ['body', 'items', 0, 'quantity'], msg: 'must be positive', type: 'value_error' },
        ],
      });
      expect(getErrorMessage(error)).toBe('quantity: must be positive');
    });
  });

  describe('with network errors', () => {
    it('handles network error', () => {
      const error = new Error('Network Error') as AxiosError;
      error.isAxiosError = true;
      error.code = 'ERR_NETWORK';
      error.config = {} as any;
      
      expect(getErrorMessage(error)).toBe('Error de conexión. Verifica tu conexión a internet.');
    });

    it('handles timeout error', () => {
      const error = new Error('Timeout') as AxiosError;
      error.isAxiosError = true;
      error.code = 'ECONNABORTED';
      error.config = {} as any;
      
      expect(getErrorMessage(error)).toBe('La solicitud tardó demasiado. Intenta de nuevo.');
    });
  });

  describe('with non-Axios errors', () => {
    it('handles standard Error', () => {
      const error = new Error('Something went wrong');
      expect(getErrorMessage(error)).toBe('Something went wrong');
    });

    it('handles unknown error types', () => {
      expect(getErrorMessage('string error')).toBe('Error desconocido');
      expect(getErrorMessage(null)).toBe('Error desconocido');
      expect(getErrorMessage(undefined)).toBe('Error desconocido');
      expect(getErrorMessage(42)).toBe('Error desconocido');
    });
  });

  describe('with empty/malformed responses', () => {
    it('falls back to axios message when no error field', () => {
      const error = createAxiosError(500, {});
      error.message = 'Internal Server Error';
      expect(getErrorMessage(error)).toBe('Internal Server Error');
    });

    it('handles empty detail array', () => {
      const error = createAxiosError(422, { detail: [] });
      error.message = 'Unprocessable Entity';
      expect(getErrorMessage(error)).toBe('Unprocessable Entity');
    });
  });
});

