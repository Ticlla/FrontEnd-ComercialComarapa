import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchProducts } from './products';
import api from '../lib/api';

// Mock the api module
vi.mock('../lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('searchProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('input validation', () => {
    it('returns empty array for empty string', async () => {
      const result = await searchProducts({ q: '' });
      
      expect(result).toEqual([]);
      expect(api.get).not.toHaveBeenCalled();
    });

    it('returns empty array for whitespace-only string', async () => {
      const result = await searchProducts({ q: '   ' });
      
      expect(result).toEqual([]);
      expect(api.get).not.toHaveBeenCalled();
    });

    it('trims whitespace before making API call', async () => {
      const mockResponse = { data: { data: [] } };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      await searchProducts({ q: '  arroz  ' });

      expect(api.get).toHaveBeenCalledWith('/products/search', {
        params: { q: 'arroz', limit: 10 },
      });
    });
  });

  describe('API calls', () => {
    it('calls API with default limit of 10', async () => {
      const mockProducts = [
        { id: '1', name: 'Arroz', sku: 'ARR-001' },
      ];
      const mockResponse = { data: { data: mockProducts } };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await searchProducts({ q: 'arroz' });

      expect(api.get).toHaveBeenCalledWith('/products/search', {
        params: { q: 'arroz', limit: 10 },
      });
      expect(result).toEqual(mockProducts);
    });

    it('calls API with custom limit', async () => {
      const mockResponse = { data: { data: [] } };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      await searchProducts({ q: 'test', limit: 5 });

      expect(api.get).toHaveBeenCalledWith('/products/search', {
        params: { q: 'test', limit: 5 },
      });
    });

    it('returns products from API response', async () => {
      const mockProducts = [
        { id: '1', name: 'Arroz Grano de Oro', sku: 'ARR-001' },
        { id: '2', name: 'Arroz Integral', sku: 'ARR-002' },
      ];
      const mockResponse = { data: { data: mockProducts } };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await searchProducts({ q: 'arroz' });

      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
    });
  });

  describe('error handling', () => {
    it('propagates API errors', async () => {
      const mockError = new Error('Network error');
      vi.mocked(api.get).mockRejectedValue(mockError);

      await expect(searchProducts({ q: 'test' })).rejects.toThrow('Network error');
    });
  });
});

