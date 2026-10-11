import { API_URL } from './auth.service';

const API_HOST = API_URL.replace(/\/api\/?$/, '');

export function resolverImagen(url: string | null | undefined): string {
  if (!url) return '';
  if (/^(https?:|blob:|data:|assets\/)/.test(url)) return url;
  return `${API_HOST}${url}`;
}
