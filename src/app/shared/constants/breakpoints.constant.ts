/**
 * Material Design 3 Breakpoints
 * Based on https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 */
export const BREAKPOINTS = {
  // Mobile (Compact width)
  MOBILE_MAX: 599,
  
  // Tablet (Medium width)
  TABLET_MIN: 600,
  TABLET_MAX: 839,
  
  // Desktop (Expanded width)
  DESKTOP_MIN: 840,
  DESKTOP_MAX: 1439,
  
  // Large Desktop (Large expanded width)
  LARGE_DESKTOP_MIN: 1440
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
