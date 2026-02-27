function requiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  NEXT_PUBLIC_SITE_URL: requiredEnv("NEXT_PUBLIC_SITE_URL", "https://makralabs.org"),
  NEXT_PUBLIC_API_BASE_URL: requiredEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:4000/api"),
  NEXT_PUBLIC_API_ORIGIN: requiredEnv("NEXT_PUBLIC_API_ORIGIN", "http://localhost:8080"),
};
