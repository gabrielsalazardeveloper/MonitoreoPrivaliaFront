// ==============================
// CONFIGURACIÓN GLOBAL
// ==============================

// TODO: Conectar con backend real usando VITE_API_URL
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const APP_CONFIG = {
  appName: 'Monitoreo Privalia - Grupo AXXO',
  version: '1.0.0',
  mockLatency: {
    min: 300,
    max: 800,
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};
