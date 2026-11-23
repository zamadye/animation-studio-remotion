export type EasingCurve =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInOutCubic'
  | 'easeOutBack';

export type SpringConfig = {
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export const clamp = (x: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, x));

export const clamp01 = (x: number): number => clamp(x, 0, 1);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const smoothstep = (t: number): number => {
  const u = clamp01(t);
  return u * u * (3 - 2 * u);
};

export const applyEasing = (t: number, curve: EasingCurve = 'easeInOut'): number => {
  const x = clamp01(t);
  switch (curve) {
    case 'linear':
      return x;
    case 'easeIn':
      return x * x;
    case 'easeOut':
      return 1 - (1 - x) * (1 - x);
    case 'easeInOut':
      return x * x * (3 - 2 * x);
    case 'easeInOutCubic':
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    case 'easeOutBack': {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
  }
};

/** Analytical damped harmonic oscillator returning progress 0 -> 1. */
export const springValue = (
  frame: number,
  fps: number,
  config: SpringConfig = {},
): number => {
  if (frame <= 0 || fps <= 0) {
    return 0;
  }
  const mass = Math.max(0.1, config.mass ?? 1);
  const stiffness = Math.max(1, config.stiffness ?? 180);
  const damping = Math.max(0.5, config.damping ?? 18);
  const t = frame / fps;
  const omega0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  let value: number;
  if (Math.abs(zeta - 1) < 1e-4) {
    value = 1 - Math.exp(-omega0 * t) * (1 + omega0 * t);
  } else if (zeta < 1) {
    const under = Math.sqrt(1 - zeta * zeta);
    const omegaD = omega0 * under;
    value =
      1 -
      Math.exp(-zeta * omega0 * t) *
        (Math.cos(omegaD * t) + (zeta / under) * Math.sin(omegaD * t));
  } else {
    const s = Math.sqrt(zeta * zeta - 1);
    const r1 = -omega0 * (zeta - s);
    const r2 = -omega0 * (zeta + s);
    value =
      1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
  }
  return Number.isFinite(value) ? value : 1;
};

/** Deterministic FNV-1a 32-bit unsigned hash. */
export const seededHash = (seed: string): number => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** Deterministic pseudo-uniform float in [0, 1). */
export const seededUnit = (seed: string): number =>
  seededHash(seed) / 4294967296;
