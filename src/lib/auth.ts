import { AuthResponse, LoginData, User } from '@/types/auth';

const BASE_URL = 'https://backend-ashen-seven-22.vercel.app';

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка при входе');
  }

  return response.json();
}

export async function register(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка при регистрации');
  }

  return response.json();
}

export async function getProfile(token: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка при получении профиля');
  }

  return response.json();
}
