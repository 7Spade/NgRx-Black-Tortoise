---
description: 'Configuration for AI behavior when generating Angular applications with TypeScript, Signals, and modern best practices'
applyTo: '**'
---

# Angular Development Rules
Configuration for AI behavior when generating Angular applications

## CRITICAL: Before generating ANY Angular code
- YOU MUST use standalone components by default unless modules are explicitly required
- YOU MUST enable strict mode in `tsconfig.json` for type safety
- YOU MUST use Angular Signals (`signal()`, `computed()`, `effect()`) for state management
- When using Angular >= 19:
  - MUST use `input()`, `output()`, `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()` functions
  - MUST NOT use decorators for these features
- If Angular < 19:
  - Use decorators for inputs, outputs, and view queries
- > NOTE: All generated code must follow Angular Style Guide (https://angular.dev/style-guide)

## When scaffolding new components or services
- Use Angular CLI commands for generation:
  - `ng generate component`: for components
  - `ng generate service`: for services
  - `ng generate pipe`: for pipes
- Follow file naming conventions:
  - Components: `feature.component.ts`
  - Services: `feature.service.ts`
  - For legacy codebases: maintain consistency with existing pattern
- Structure components with clear separation:
  - Smart components: handle data and state
  - Presentational components: receive data via inputs, emit via outputs

## CRITICAL: TypeScript standards
- MUST define clear interfaces and types for all components, services, and models
- MUST use type guards and union types for robust type checking
- MUST implement proper error handling with RxJS operators (e.g., `catchError`)
- MUST use typed forms (`FormGroup<T>`, `FormControl<T>`) for reactive forms
- Do not use `any` type without explicit justification

## When implementing state management
- Use Angular Signals for reactive state:
  - `signal()` for writable state
  - `computed()` for derived state
  - `effect()` for side effects
- Handle loading and error states with signals
- Use `AsyncPipe` in templates when combining signals with RxJS
- MUST NOT manually subscribe to observables in components (use `AsyncPipe` or `toSignal()`)

## When implementing data fetching
- Use Angular's `HttpClient` for API calls with proper typing
- Use `inject()` function for dependency injection in standalone components
- Implement caching strategies (e.g., `shareReplay` for observables)
- Store API response data in signals for reactive updates
- Handle API errors with global interceptors
- EXAMPLE:
  - After: Creating a data service
  - Do: Define typed interfaces, use `HttpClient`, convert to signals
  - Before: Exposing to components

## CRITICAL: Security requirements
- MUST sanitize user inputs using Angular's built-in sanitization
- MUST implement route guards for authentication and authorization
- MUST use `HttpInterceptor` for CSRF protection and API authentication headers
- MUST validate form inputs with reactive forms and custom validators
- MUST NOT manipulate DOM directly (use Angular directives instead)

## When styling components
- Use component-level CSS encapsulation (default: `ViewEncapsulation.Emulated`)
- Prefer SCSS for styling with consistent theming
- Implement responsive design using CSS Grid, Flexbox, or Angular CDK Layout
- Follow Angular Material's theming guidelines if used
- MUST maintain accessibility (a11y) with ARIA attributes and semantic HTML

## When optimizing performance
- Enable production builds with `ng build --configuration production`
- Use lazy loading for routes to reduce initial bundle size
- Use `OnPush` change detection strategy with signals
- Use `trackBy` in loops for better rendering performance
- If specified: implement SSR or SSG with Angular Universal

## When writing tests
- Write unit tests for components, services, and pipes using Jasmine and Karma
- Use `TestBed` for component testing with mocked dependencies
- Test signal-based state updates
- Write E2E tests with Cypress or Playwright (if specified)
- Mock HTTP requests using `provideHttpClientTesting`
- MUST ensure high test coverage for critical functionality

## General
- Follow Angular Style Guide for all naming conventions
- Use Angular CLI for generating boilerplate code
- Document components and services with JSDoc comments
- Ensure WCAG 2.1 accessibility compliance where applicable
- Use Angular's built-in i18n for internationalization (if specified)
- Keep code DRY with reusable utilities and shared modules
- Organize code by feature modules or domains for scalability
- Use Angular's built-in dependency injection system effectively
