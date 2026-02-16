// ==============================
// LOCAL STATE - HELPERS PARA PERSISTENCIA
// ==============================

import { STORAGE_KEYS } from "@/config";
import { User } from "@/types/interfaces";

export const localState = {
  // Auth
  setAuthToken: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getAuthToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  removeAuthToken: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setUserData: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  getUserData: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  removeUserData: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  clearAll: () => {
    localStorage.clear();
  },
};
