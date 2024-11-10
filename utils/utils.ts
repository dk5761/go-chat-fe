import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function generateCacheQueryKeyForOptions(key: string, ...options: any) {
  return [key, ...options];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
