import { createContext, useContext, useEffect, useState } from 'react';
import { login, logout, getToken } from '../services/authServices';
import { getUserDetails } from '../services/userServices';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

type User = {
  id: string;
  email: string;
  role: 'customer' | 'driver';
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loginUser: (username: string, password: string) => Promise<void>;
  signupUser: (email: string, username: string, fullName: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

const loginUser = async (username: string, password: string) => {
  const t = await login(username, password);
  await SecureStore.setItemAsync('token', t); // Persist it across sessions
  const u = await getUserDetails(t);
  setToken(t);
  setUser(u);
};


  const signupUser = async (
    email: string,
    username: string,
    fullName: string,
    password: string
  ) => {
    const payload = {
      email,
      username,
      full_name: fullName,
      password,
      is_active: true,
    };
    await api.post('users/', payload);
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    (async () => {
      const t = await getToken();
      if (t) {
        try {
          const u = await getUserDetails(t);
          setToken(t);
          setUser(u);
        } catch {
          setToken(null);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loginUser, signupUser, logoutUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};