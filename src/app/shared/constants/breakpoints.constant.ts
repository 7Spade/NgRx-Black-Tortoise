/**
 * Material Design 3 Breakpoints
 * Based on https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 * 
 * Provides both numeric values (for programmatic use) and media query strings
 * (for BreakpointObserver) in a single unified constant.
 */

/**
 * Breakpoint numeric values (in pixels)
 */
export const BREAKPOINT_VALUES = {
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

/**
 * Media query strings for use with BreakpointObserver
 */
export const BREAKPOINT_QUERIES = {
  /**
   * Mobile devices (phones)
   * Width: 0-599px
   */
  mobile: '(max-width: 599.98px)',
  
  /**
   * Tablet devices
   * Width: 600-839px
   */
  tablet: '(min-width: 600px) and (max-width: 839.98px)',
  
  /**
   * Desktop (small)
   * Width: 840-1239px
   */
  desktop: '(min-width: 840px) and (max-width: 1239.98px)',
  
  /**
   * Desktop (large)
   * Width: 1240px+
   */
  desktopLarge: '(min-width: 1240px)',
  
  /**
   * Portrait orientation
   */
  portrait: '(orientation: portrait)',
  
  /**
   * Landscape orientation
   */
  landscape: '(orientation: landscape)',
} as const;

/**
 * Unified BREAKPOINTS constant
 * Provides both numeric values and media query strings
 */
export const BREAKPOINTS = {
  ...BREAKPOINT_VALUES,
  ...BREAKPOINT_QUERIES
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
