import api from './api';
import * as SecureStore from 'expo-secure-store';

export async function login(username: string, password: string): Promise<string> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('grant_type', 'password');

  const response = await api.post('/auth/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const token = response.data?.access_token;
  if (!token) throw new Error('No access token returned.');

  await SecureStore.setItemAsync('token', token);
  return token;
}

export async function signup(email: string, password: string) {
  const res = await api.post('/auth/signup', { email, password });
  await SecureStore.setItemAsync('token', res.data.access_token);
}

export async function logout() {
  await SecureStore.deleteItemAsync('token');
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('token');
}
