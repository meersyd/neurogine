import { useCallback, useEffect, useState } from 'react';
import { getProductById } from '../../data/api/productsApi';
import { isAbortError } from '../../data/api/http';
import type { Product } from '../../data/types/product';

export type DetailPhase = 'loading' | 'error' | 'success';

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function useProductDetail(idParam: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [phase, setPhase] = useState<DetailPhase>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const parsedId = Number(idParam);
  const isValidId = Number.isInteger(parsedId) && parsedId > 0;

  useEffect(() => {
    if (!isValidId) {
      setProduct(null);
      setPhase('error');
      setErrorMessage('This product id is invalid.');
      return;
    }

    const controller = new AbortController();

    async function load() {
      setPhase('loading');
      setErrorMessage(null);
      setProduct(null);

      try {
        const response = await getProductById(parsedId, controller.signal);
        setProduct(response);
        setPhase('success');
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
        setErrorMessage(toErrorMessage(error));
        setPhase('error');
      }
    }

    load();
    return () => controller.abort();
  }, [isValidId, parsedId, reloadToken]);

  const retry = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  return { product, phase, errorMessage, retry };
}
