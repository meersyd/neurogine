/// <reference types="jest" />

import { hasMoreProducts, PAGE_SIZE } from '../pagination';
import { getProducts, searchProducts } from './productsApi';

const sampleProduct = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  description: 'A mascara.',
  price: 9.99,
  rating: 2.56,
  thumbnail: 'https://cdn.dummyjson.com/thumb.webp',
  images: ['https://cdn.dummyjson.com/1.webp'],
};

const originalFetch = globalThis.fetch;

function mockFetch(response: { ok: boolean; status?: number; json?: () => Promise<unknown> }) {
  const fetchMock = jest.fn().mockResolvedValue(response);
  globalThis.fetch = fetchMock as typeof fetch;
  return fetchMock;
}

describe('hasMoreProducts', () => {
  it('is true while loaded count is below total', () => {
    expect(hasMoreProducts(20, 194)).toBe(true);
  });

  it('is false when every item has been loaded', () => {
    expect(hasMoreProducts(194, 194)).toBe(false);
    expect(hasMoreProducts(200, 194)).toBe(false);
  });
});

describe('productsApi', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('requests a paginated product list and returns the payload', async () => {
    const payload = {
      products: [sampleProduct],
      total: 194,
      skip: 20,
      limit: PAGE_SIZE,
    };

    const fetchMock = mockFetch({
      ok: true,
      json: async () => payload,
    });

    const result = await getProducts(20);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=20&skip=20',
      { signal: undefined },
    );
    expect(result).toEqual(payload);
  });

  it('encodes the search query and keeps skip pagination', async () => {
    const fetchMock = mockFetch({
      ok: true,
      json: async () => ({ products: [], total: 0, skip: 0, limit: PAGE_SIZE }),
    });

    await searchProducts('phone case', 40);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products/search?q=phone%20case&limit=20&skip=40',
      { signal: undefined },
    );
  });

  it('throws HttpError when the response is not ok', async () => {
    mockFetch({
      ok: false,
      status: 500,
    });

    await expect(getProducts(0)).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
    });
  });
});
