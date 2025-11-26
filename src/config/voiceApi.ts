// Configuração da API de Voice Authentication
export const API_BASE_URL = 'http://72.61.33.18:8001';

export const API_ENDPOINTS = {
  HEALTH: '/health',
  CHALLENGE: '/voice/challenge',
  ENROLL: '/voice/enroll',
  VERIFY: '/voice/verify',
} as const;

export const API_TIMEOUT = 30000; // 30 segundos