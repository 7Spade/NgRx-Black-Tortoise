/**
 * Responsive Breakpoints for Material Design 3
 * 
 * Following Material Design 3 breakpoint guidelines:
 * https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 */

export const BREAKPOINTS = {
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
 * Breakpoint values (in pixels) for programmatic use
 */
export const BREAKPOINT_VALUES = {
  mobile: 0,
  tablet: 600,
  desktop: 840,
  desktopLarge: 1240,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
