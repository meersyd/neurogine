import { useCallback, useEffect, useRef, useState } from 'react';
import { getProducts } from '../../data/api/productsApi';
import { isAbortError } from '../../data/api/http';
import { hasMoreProducts } from '../../data/pagination';
import type { Product } from '../../data/types/product';

export type ListPhase = 'loading' | 'error' | 'success';

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function useProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [phase, setPhase] = useState<ListPhase>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const productsRef = useRef(products);
  const totalRef = useRef(total);
  const loadingMoreRef = useRef(false);

  productsRef.current = products;
  totalRef.current = total;

  useEffect(() => {
    const controller = new AbortController();

    async function loadFirstPage() {
      setPhase('loading');
      setErrorMessage(null);
      setLoadMoreError(null);
      setProducts([]);
      setTotal(0);

      try {
        const response = await getProducts(0, controller.signal);
        setProducts(response.products);
        setTotal(response.total);
        setPhase('success');
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
        setErrorMessage(toErrorMessage(error));
        setPhase('error');
      }
    }

    loadFirstPage();
    return () => controller.abort();
  }, [reloadToken]);

  const retry = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  const loadMore = useCallback(async () => {
    if (phase !== 'success' || loadingMoreRef.current) {
      return;
    }
    if (!hasMoreProducts(productsRef.current.length, totalRef.current)) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await getProducts(productsRef.current.length);
      setProducts((current) => {
        const seen = new Set(current.map((product) => product.id));
        const incoming = response.products.filter((product) => !seen.has(product.id));
        return [...current, ...incoming];
      });
      setTotal(response.total);
    } catch (error) {
      if (!isAbortError(error)) {
        setLoadMoreError(toErrorMessage(error));
      }
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [phase]);

  return {
    products,
    phase,
    errorMessage,
    isLoadingMore,
    loadMoreError,
    hasMore: hasMoreProducts(products.length, total),
    retry,
    loadMore,
  };
}
