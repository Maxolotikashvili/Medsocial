export const AUTH_CONFIG = {
  REFRESH_BUFFER_MS: 5 * 60 * 1000,
  DEFAULT_CHECK_INTERVAL: 15 * 60 * 1000, 

  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token'
  }
} as const;