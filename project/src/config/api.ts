const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_BASE_URL = rawApiBase.replace(/\/+$/, '');

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
