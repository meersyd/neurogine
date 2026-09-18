export const PAGE_SIZE = 20;

export function hasMoreProducts(loadedCount: number, total: number): boolean {
  return loadedCount < total;
}
