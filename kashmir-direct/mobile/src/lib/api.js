import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const fetchWithAuth = async (endpoint, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'API request failed');
  }

  return response.json();
};

export const api = {
  products: {
    getAll: () => fetchWithAuth('/products'),
    getOne: (id) => fetchWithAuth(`/products/${id}`),
    create: (data) => fetchWithAuth('/products', { method: 'POST', body: JSON.stringify(data) }),
  },
  sellers: {
    getAll: () => fetchWithAuth('/sellers'),
    getOne: (id) => fetchWithAuth(`/sellers/${id}`),
  },
};
