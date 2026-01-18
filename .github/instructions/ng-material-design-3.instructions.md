---
description: 'Material Design 3 (Material You) implementation guidelines for Angular applications with theming, color systems, and accessibility'
applyTo: '**/*.scss, **/*.css, **/theme*.ts'
---

# Material Design 3 Implementation Guidelines

## Overview

Material Design 3 (Material You) is Google's latest design system emphasizing personalization, accessibility, and modern aesthetics. This guide covers implementation in Angular applications.

## Core Principles

### 1. Dynamic Color System

**Use M3 Color Roles:**
```scss
// Primary colors
--mat-sys-primary
--mat-sys-on-primary
--mat-sys-primary-container
--mat-sys-on-primary-container

// Secondary colors
--mat-sys-secondary
--mat-sys-on-secondary
--mat-sys-secondary-container
--mat-sys-on-secondary-container

// Tertiary colors
--mat-sys-tertiary
--mat-sys-on-tertiary
--mat-sys-tertiary-container
--mat-sys-on-tertiary-container

// Error colors
--mat-sys-error
--mat-sys-on-error
--mat-sys-error-container
--mat-sys-on-error-container

// Surface colors
--mat-sys-surface
--mat-sys-on-surface
--mat-sys-surface-variant
--mat-sys-on-surface-variant
--mat-sys-surface-container
--mat-sys-surface-container-high
--mat-sys-surface-container-highest

// Outline colors
--mat-sys-outline
--mat-sys-outline-variant
```

### 2. Typography Scale

**Use M3 Typography Tokens:**
```scss
// Display styles (largest)
--mat-sys-display-large
--mat-sys-display-medium
--mat-sys-display-small

// Headline styles
--mat-sys-headline-large
--mat-sys-headline-medium
--mat-sys-headline-small

// Title styles
--mat-sys-title-large
--mat-sys-title-medium
--mat-sys-title-small

// Body styles
--mat-sys-body-large
--mat-sys-body-medium
--mat-sys-body-small

// Label styles
--mat-sys-label-large
--mat-sys-label-medium
--mat-sys-label-small
```

### 3. Elevation and Shadows

**Use M3 Elevation Tokens:**
```scss
// Elevation levels
--mat-sys-level0  // No shadow
--mat-sys-level1  // Subtle elevation
--mat-sys-level2  // Moderate elevation
--mat-sys-level3  // High elevation
--mat-sys-level4  // Highest elevation
--mat-sys-level5  // Maximum elevation
```

### 4. Shape System

**Use M3 Corner Radius Tokens:**
```scss
// Corner radius values
--mat-sys-corner-none       // 0dp
--mat-sys-corner-extra-small // 4dp
--mat-sys-corner-small      // 8dp
--mat-sys-corner-medium     // 12dp
--mat-sys-corner-large      // 16dp
--mat-sys-corner-extra-large // 28dp
--mat-sys-corner-full       // 50% (fully rounded)
```

## Theme Configuration

### Creating a Custom Theme

```scss
@use '@angular/material' as mat;

// Include core styles
@include mat.core();

// Define your theme
$my-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,
    tertiary: mat.$blue-palette,
  ),
  typography: (
    brand-family: 'Roboto',
    plain-family: 'Roboto',
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ),
  density: (
    scale: 0
  )
));

// Apply theme to all components
@include mat.all-component-themes($my-theme);

// Dark theme variant
$my-dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.$azure-palette,
    tertiary: mat.$blue-palette,
  )
));

// Apply dark theme when .dark-theme class is present
.dark-theme {
  @include mat.all-component-colors($my-dark-theme);
}
```

### Dynamic Theme Switching

```typescript
// theme.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkMode = signal(false);
  
  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
    this.applyTheme(this.isDarkMode());
  }
  
  private applyTheme(isDark: boolean) {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
  
  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
  }
}
```

## Component Styling Best Practices

### 1. Use Color Tokens

```scss
// ✅ Good - Use design tokens
.custom-card {
  background-color: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface);
  
  &:hover {
    background-color: var(--mat-sys-surface-container);
  }
}

// ❌ Bad - Hardcoded colors
.custom-card {
  background-color: #ffffff;
  color: #000000;
}
```

### 2. Implement State Layers

```scss
// State layers for interactive components
.interactive-element {
  background-color: var(--mat-sys-surface);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--mat-sys-on-surface);
    opacity: 0;
    transition: opacity 200ms;
  }
  
  &:hover::before {
    opacity: 0.08; // M3 hover state layer
  }
  
  &:focus::before {
    opacity: 0.12; // M3 focus state layer
  }
  
  &:active::before {
    opacity: 0.16; // M3 pressed state layer
  }
}
```

### 3. Typography Implementation

```scss
// Apply typography tokens
.page-title {
  font: var(--mat-sys-headline-large);
  color: var(--mat-sys-on-surface);
}

.section-title {
  font: var(--mat-sys-title-medium);
  color: var(--mat-sys-on-surface-variant);
}

.body-text {
  font: var(--mat-sys-body-medium);
  color: var(--mat-sys-on-surface);
}

.label-text {
  font: var(--mat-sys-label-small);
  color: var(--mat-sys-on-surface-variant);
}
```

### 4. Elevation and Shadows

```scss
.elevated-card {
  background-color: var(--mat-sys-surface);
  box-shadow: var(--mat-sys-level2);
  border-radius: var(--mat-sys-corner-medium);
  
  &:hover {
    box-shadow: var(--mat-sys-level3);
  }
}

.floating-action-button {
  box-shadow: var(--mat-sys-level3);
  
  &:active {
    box-shadow: var(--mat-sys-level1);
  }
}
```

## Accessibility Standards

### 1. Color Contrast

**Ensure Minimum Contrast Ratios:**
- Normal text: 4.5:1
- Large text (18.5px+ or 24px+): 3:1
- UI components: 3:1

```scss
// M3 tokens automatically provide accessible contrast
.text-on-primary {
  background-color: var(--mat-sys-primary);
  color: var(--mat-sys-on-primary); // Guaranteed contrast
}

.text-on-surface {
  background-color: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface); // Guaranteed contrast
}
```

### 2. Focus Indicators

```scss
// Visible focus indicators
.focusable-element {
  outline: none;
  
  &:focus-visible {
    outline: 2px solid var(--mat-sys-primary);
    outline-offset: 2px;
  }
}
```

### 3. Touch Targets

```scss
// Minimum 48x48dp touch targets
.touch-target {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
}
```

## Responsive Design

### Breakpoint Strategy

```scss
// Material Design breakpoints
$breakpoints: (
  handset: '(max-width: 599px)',
  tablet: '(min-width: 600px) and (max-width: 959px)',
  desktop: '(min-width: 960px)',
  large-desktop: '(min-width: 1280px)'
);

// Responsive layouts
.responsive-grid {
  display: grid;
  gap: 16px;
  
  @media #{map-get($breakpoints, handset)} {
    grid-template-columns: 1fr;
  }
  
  @media #{map-get($breakpoints, tablet)} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media #{map-get($breakpoints, desktop)} {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Performance Optimization

### 1. CSS Custom Properties

```scss
// Leverage CSS variables for dynamic theming
:root {
  --app-spacing-sm: 8px;
  --app-spacing-md: 16px;
  --app-spacing-lg: 24px;
}

.container {
  padding: var(--app-spacing-md);
}
```

### 2. Minimize Repaints

```scss
// Use transform instead of top/left for animations
.animated-element {
  transform: translateY(0);
  transition: transform 200ms;
  
  &.moved {
    transform: translateY(100px);
  }
}
```

## Common Patterns

### Button Styles

```scss
.m3-button {
  padding: 10px 24px;
  border-radius: var(--mat-sys-corner-full);
  font: var(--mat-sys-label-large);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &.filled {
    background-color: var(--mat-sys-primary);
    color: var(--mat-sys-on-primary);
    
    &:hover {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
  }
  
  &.outlined {
    background-color: transparent;
    border: 1px solid var(--mat-sys-outline);
    color: var(--mat-sys-primary);
    
    &:hover {
      background-color: var(--mat-sys-surface-variant);
    }
  }
  
  &.text {
    background-color: transparent;
    color: var(--mat-sys-primary);
    
    &:hover {
      background-color: var(--mat-sys-surface-variant);
    }
  }
}
```

### Card Styles

```scss
.m3-card {
  background-color: var(--mat-sys-surface);
  border-radius: var(--mat-sys-corner-large);
  padding: 16px;
  box-shadow: var(--mat-sys-level1);
  
  &.elevated {
    box-shadow: var(--mat-sys-level2);
    
    &:hover {
      box-shadow: var(--mat-sys-level3);
    }
  }
  
  &.filled {
    background-color: var(--mat-sys-surface-container-high);
  }
  
  &.outlined {
    border: 1px solid var(--mat-sys-outline-variant);
    box-shadow: none;
  }
}
```

## Testing and Validation

### 1. Color Contrast Testing

- Use browser DevTools to check contrast ratios
- Test with WCAG AA compliance tools
- Verify both light and dark themes

### 2. Responsive Testing

- Test on different viewport sizes
- Verify touch target sizes on mobile
- Check spacing and layout on tablets

### 3. Theme Switching

- Test theme transitions
- Verify all components update correctly
- Check for flickering or visual glitches

## Migration from Material Design 2

### Key Changes

1. **Color System**: Switch from color palettes to theme-type with color roles
2. **Typography**: Migrate from mat-typography-level to M3 typography tokens
3. **Elevation**: Replace elevation mixins with CSS custom properties
4. **Components**: Update component styles to use design tokens

### Migration Checklist

- [ ] Update theme configuration to use `define-theme()`
- [ ] Replace hardcoded colors with M3 color tokens
- [ ] Update typography to use M3 type scale
- [ ] Replace elevation mixins with CSS variables
- [ ] Test accessibility with new contrast requirements
- [ ] Verify component styles in both light and dark themes

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Angular Material Theming](https://material.angular.io/guide/theming)
- [WCAG Accessibility Standards](https://www.w3.org/WAI/WCAG21/quickref/)
