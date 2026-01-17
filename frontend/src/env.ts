type Env = {
  apiBaseUrl: string;
  wsBaseUrl: string;
};

function getEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env: Env = {
  apiBaseUrl: getEnv("VITE_API_BASE_URL"),
  wsBaseUrl: getEnv("VITE_WS_BASE_URL"),
};
