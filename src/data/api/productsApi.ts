import { getJson } from './http';
import type { Product, ProductListResponse } from '../types/product';
import { PAGE_SIZE } from '../pagination';

export function getProducts(skip: number, signal?: AbortSignal): Promise<ProductListResponse> {
  return getJson<ProductListResponse>(`/products?limit=${PAGE_SIZE}&skip=${skip}`, signal);
}

export function searchProducts(
  query: string,
  skip: number,
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  const encodedQuery = encodeURIComponent(query);
  return getJson<ProductListResponse>(
    `/products/search?q=${encodedQuery}&limit=${PAGE_SIZE}&skip=${skip}`,
    signal,
  );
}

export function getProductById(id: number, signal?: AbortSignal): Promise<Product> {
  return getJson<Product>(`/products/${id}`, signal);
}
