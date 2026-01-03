/**
 * Axios instance configured for the Comercial Comarapa API.
 */

import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ErrorResponse } from '../types/api';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const API_TIMEOUT = 10000; // 10 seconds

// =============================================================================
// AXIOS INSTANCE
// =============================================================================

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed in the future
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

api.interceptors.response.use(
  (response) => {
    // Return full response (access .data in service layer)
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login (future)
          console.error('Unauthorized access');
          break;
        case 404:
          console.error('Resource not found:', data?.error || 'Unknown');
          break;
        case 422:
          console.error('Validation error:', data?.detail || 'Unknown');
          break;
        case 500:
          console.error('Server error:', data?.error || 'Internal server error');
          break;
        default:
          console.error(`API Error ${status}:`, data?.error || 'Unknown error');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response received');
    } else {
      // Error setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * FastAPI validation error detail item.
 */
interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * Parse FastAPI validation error detail (can be string or array).
 */
function parseValidationDetail(detail: unknown): string | null {
  if (typeof detail === 'string') {
    return detail;
  }
  
  if (Array.isArray(detail) && detail.length > 0) {
    const firstError = detail[0] as ValidationErrorDetail;
    if (firstError.loc && firstError.msg) {
      const field = firstError.loc.slice(-1)[0];
      return `${field}: ${firstError.msg}`;
    }
  }
  
  return null;
}

/**
 * Extract error message from Axios error.
 * Handles both string errors and FastAPI validation error arrays.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const data = axiosError.response?.data;
    
    // Try to get error from response
    if (data?.error) {
      return data.error;
    }
    
    // Handle FastAPI validation errors (422)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detail = (data as any)?.detail;
    if (detail) {
      const parsed = parseValidationDetail(detail);
      if (parsed) return parsed;
    }
    
    // Network error
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    
    // Timeout
    if (axiosError.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Intenta de nuevo.';
    }
    
    return axiosError.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Error desconocido';
}

export default api;

