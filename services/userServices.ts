import api from './api';
import { jwtDecode } from "jwt-decode";

export function getUserId(token: string): string | null {
  try {
    const decoded = jwtDecode<{ sub: string }>(token);
    return decoded.sub;
  } catch {
    return null;
  }
}

export async function getUserDetails(token: string) {
  const userId = getUserId(token);
  if (!userId) throw new Error('Invalid token.');
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const res = await api.get(`/users/${userId}`);
  return res.data;
}

export async function getDriverDetails(token: string) {
  const userId = getUserId(token);
  if (!userId) throw new Error('Invalid token.');
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const res = await api.get(`/drivers/user/${userId}`);
  return res.data;
}
