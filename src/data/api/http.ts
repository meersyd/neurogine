export const API_BASE_URL = 'https://dummyjson.com';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });

  if (!response.ok) {
    throw new HttpError(response.status, `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}
