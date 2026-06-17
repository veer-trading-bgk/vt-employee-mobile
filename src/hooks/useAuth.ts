import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { secureGet } from '@/services/storage';

export function useAuth() {
  const { user, token, isLoading, login, logout, restore } = useAuthStore();

  useEffect(() => {
    restore();
  }, []);

  return { user, token, isLoading, login, logout };
}
