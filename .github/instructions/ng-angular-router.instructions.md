---
description: 'Angular Router configuration with lazy loading, guards, and parameter handling'
applyTo: '**/*.routes.ts, **/*routing*.ts, **/*guard*.ts'
---

# Angular Router Development Guidelines

## Route Configuration

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard]
  },
  { path: '**', component: NotFoundComponent }
];
```

## Route Guards

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

## Route Parameters

```typescript
// Access route params with signals
userId = toSignal(
  this.route.params.pipe(map(params => params['id'])),
  { initialValue: null }
);
```

## Best Practices

- ✅ Use lazy loading for feature modules
- ✅ Implement route guards for auth/permissions
- ✅ Use functional guards with inject()
- ✅ Handle route errors with redirects
- ❌ Don't load everything eagerly
- ❌ Don't forget to unsubscribe from route observables
