import { createHash } from 'crypto';

export function generateSeed(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function calculateCrashPoint(seed: string): number {
  // Provably fair algorithm using SHA-256
  const hash = createHash('sha256').update(seed).digest('hex');
  
  // Convert hash to number between 1.00 and 100.00
  const value = parseInt(hash.slice(0, 8), 16);
  const crashPoint = ((value % 9900) + 100) / 100;
  
  return Math.max(1.01, Math.min(100, crashPoint));
}

export function calculateMultiplier(elapsedMs: number): number {
  // Exponential growth: multiplier = e^(t/6000)
  // This gives smooth growth from 1.00x to higher values
  return Math.pow(Math.E, elapsedMs / 6000);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
