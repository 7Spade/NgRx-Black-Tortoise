---
description: 'Configuration for AI behavior when implementing Angular Router with lazy loading, guards, and navigation'
applyTo: '**'
---

# Angular Router Rules
Configuration for AI behavior when implementing Angular routing

## CRITICAL: Lazy loading is MANDATORY for feature modules
- YOU MUST use lazy loading for all feature modules to reduce initial bundle size
- Configure routes with `loadChildren`:
  ```typescript
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.routes').then(m => m.FEATURE_ROUTES)
  }
  ```
- MUST NOT eagerly load feature modules unless explicitly required
- > NOTE: Eager loading increases initial bundle size and slows app startup

## When implementing route guards
- Use functional guards with `inject()`:
  ```typescript
  export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if (authService.isAuthenticated()) {
      return true;
    }
    
    return router.createUrlTree(['/login']);
  };
  ```
- Apply guards to routes:
  - `canActivate`: control route access
  - `canActivateChild`: control child route access
  - `canDeactivate`: prevent navigation away (unsaved changes)
  - `canMatch`: conditionally load routes
- MUST NOT use class-based guards (deprecated pattern)

## When accessing route parameters
- Use `toSignal()` to convert route params to signals:
  ```typescript
  userId = toSignal(
    this.route.params.pipe(map(params => params['id'])),
    { initialValue: null }
  );
  ```
- Access query params similarly:
  ```typescript
  filter = toSignal(
    this.route.queryParams.pipe(map(params => params['filter'])),
    { initialValue: '' }
  );
  ```
- MUST clean up subscriptions if not using `toSignal()` or `AsyncPipe`

## CRITICAL: Handle route errors and redirects
- Configure fallback route for 404:
  ```typescript
  { path: '**', component: NotFoundComponent }
  ```
- Handle route errors with error handlers
- Provide user-friendly error pages
- Log navigation errors for debugging

## When configuring routes
- Always provide default redirect:
  ```typescript
  { path: '', redirectTo: '/home', pathMatch: 'full' }
  ```
- Use `pathMatch: 'full'` for empty path redirects
- Order routes from specific to general (wildcard last)
- Group related routes with parent-child relationships

## General
- Use lazy loading for all feature modules
- Implement guards for authentication and authorization
- Use functional guards with `inject()`
- Convert route params to signals with `toSignal()`
- Handle 404 with wildcard route
- Test navigation flows and guard logic
- Document complex routing configurations
