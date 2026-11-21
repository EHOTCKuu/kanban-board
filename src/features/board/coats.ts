import type { CatCoat } from './types';

export const COATS: Record<CatCoat, { bg: string; spot: string }> = {
  ginger: { bg: '#e8a05a', spot: '#c97a3a' },
  tabby: { bg: '#b8895c', spot: '#6b4a2f' },
  tuxedo: { bg: '#e8e2d8', spot: '#2a2a2a' },
  calico: { bg: '#f2d5a8', spot: '#c97a3a' },
  siamese: { bg: '#f2e6d0', spot: '#5a4634' },
  british: { bg: '#9aa6b0', spot: '#5d6b78' },
  tortoise: { bg: '#6b4f3a', spot: '#2e1f14' },
  white: { bg: '#f8f4ec', spot: '#d9d0bf' },
  black: { bg: '#2a2a2a', spot: '#0f0f0f' },
  cow: { bg: '#f4efe6', spot: '#2a2a2a' },
};

export const COAT_KEYS = Object.keys(COATS) as CatCoat[];

export function randomCoat(): CatCoat {
  return COAT_KEYS[Math.floor(Math.random() * COAT_KEYS.length)];
}
