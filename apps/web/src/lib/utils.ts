import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatMultiplier(multiplier: number): string {
  return `${multiplier.toFixed(2)}x`;
}

export function generateSeed(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function calculateCrashPoint(seed: string): number {
  // Provably fair algorithm using seed
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  
  // Convert hash to number between 1.00 and 100.00
  const value = parseInt(hash.slice(0, 8), 16);
  const crashPoint = ((value % 9900) + 100) / 100;
  
  return Math.max(1.01, Math.min(100, crashPoint));
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
