export function generateCacheQueryKeyForOptions(key: string, ...options: any) {
  return [key, ...options];
}
