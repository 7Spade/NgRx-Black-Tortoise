# ADR-001: Observable Usage in Domain Repository Interfaces

**Status:** Accepted

**Date:** 2026-01-18

**Decision Makers:** Architecture Team

## Context

In pure Domain-Driven Design (DDD), the domain layer should be completely framework-agnostic and have zero dependencies on external libraries. However, our repository interfaces in `src/app/domain/repositories/` use RxJS `Observable` type.

### Current Implementation

```typescript
// domain/repositories/auth.repository.interface.ts
import { Observable } from 'rxjs';
import { AuthUser } from '../account';

export interface AuthRepository {
  readonly authState$: Observable<AuthUser | null>;
  login(email: string, password: string): Observable<AuthUser>;
  register(email: string, password: string): Observable<AuthUser>;
  resetPassword(email: string): Observable<void>;
  logout(): Observable<void>;
}
```

### The Dilemma

**Pure DDD Approach:**
- Domain layer should use `Promise` or custom async abstraction
- No framework dependencies (including RxJS)
- Maximum portability and framework independence

**Pragmatic Angular Approach:**
- Use `Observable` to align with Angular ecosystem
- Seamless integration with NgRx Signals `rxMethod`
- Leverage RxJS operators for complex async flows

## Decision

We **accept Observable usage** in domain repository interfaces as a pragmatic architectural trade-off for our Angular-based application.

## Rationale

### 1. NgRx Signals Integration

Our application stores use `@ngrx/signals` with `rxMethod` for all async operations:

```typescript
// application/auth/stores/auth.store.ts
withMethods((store, authRepository = inject(AUTH_REPOSITORY)) => ({
  login: rxMethod<{ email: string; password: string }>(
    pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(({ email, password }) => authRepository.login(email, password)),
      tapResponse({
        next: (user) => patchState(store, { user, loading: false }),
        error: (error: Error) => patchState(store, { error: error.message, loading: false })
      })
    )
  )
}))
```

**`rxMethod` requires Observable** - using Promise would require:
- Manual conversion (`from(promise)`) in every store method
- Loss of RxJS operator composition benefits
- Increased boilerplate code

### 2. Reactive Patterns Throughout Application

Our entire application is built on reactive patterns:
- Firebase returns Observables (`authState`, `collectionData`, etc.)
- NgRx Signals stores use `rxMethod` for side effects
- Components consume signals derived from observables
- Event-driven architecture relies on observable streams

Changing to Promise would break these patterns.

### 3. RxJS Operator Composition

Repository operations benefit from RxJS operators:

```typescript
// Complex async flows with operators
authRepository.login(email, password).pipe(
  switchMap(user => accountRepository.ensureAccountExists(user)),
  tap(account => analytics.trackLogin(account)),
  catchError(error => this.handleAuthError(error))
)
```

Promise-based approach would require:
- Manual chaining with `.then()` (less composable)
- External error handling libraries
- Loss of cancellation capabilities

### 4. Infrastructure Simplicity

Our Firebase infrastructure implementations naturally return Observables:

```typescript
// infrastructure/auth/services/auth.service.ts
export class AuthService implements AuthRepository {
  login(email: string, password: string): Observable<AuthUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(map(credential => this.toAuthUser(credential.user)));
  }
}
```

Using Promise in interfaces would require converting back to Observable in application layer.

### 5. Framework Alignment

Angular ecosystem standardizes on Observables:
- `HttpClient` returns Observable
- Router events are Observable
- Form value changes are Observable
- AngularFire returns Observable

Fighting this pattern creates friction and complexity.

## Consequences

### Benefits ✅

1. **Zero Conversion Overhead**
   - No `from()` conversions in every store method
   - Direct pipeline from repository → rxMethod → signal

2. **Operator Composition**
   - Full access to RxJS operators for complex flows
   - Declarative async operations
   - Built-in cancellation and retry logic

3. **Type Safety**
   - TypeScript inference works seamlessly
   - No manual type assertions needed
   - Better IDE autocomplete

4. **Performance**
   - No Promise wrapper overhead
   - Efficient stream composition
   - Lazy evaluation of operators

5. **Maintainability**
   - Consistent patterns across codebase
   - Less boilerplate code
   - Familiar patterns for Angular developers

### Trade-offs ⚠️

1. **RxJS Dependency in Domain**
   - Domain layer has RxJS import (limited to repository interfaces)
   - Not "pure" DDD (but pragmatic for Angular)
   - Migration to another framework would require interface changes

2. **Learning Curve**
   - Developers must understand Observables
   - More complex than Promise for simple cases
   - Requires RxJS knowledge

### Mitigation Strategies

1. **Limit RxJS to Repository Interfaces**
   - Domain entities remain pure (no RxJS)
   - Value objects remain pure (no RxJS)
   - Only repository contracts use Observable

2. **Document This Decision**
   - Clear ADR explaining rationale
   - Training materials for team
   - Code review guidelines

3. **Interface Segregation**
   - Repository interfaces are thin abstractions
   - Business logic in domain entities/services
   - Infrastructure details isolated

## Alternatives Considered

### Alternative 1: Use Promise in Repository Interfaces

```typescript
export interface AuthRepository {
  login(email: string, password: string): Promise<AuthUser>;
}
```

**Rejected because:**
- Requires `from()` conversion in every store method
- Loss of RxJS operator composition
- Inconsistent with Angular ecosystem
- No cancellation support

### Alternative 2: Custom Async Abstraction

```typescript
interface AsyncResult<T> {
  subscribe(observer: Observer<T>): Subscription;
}
```

**Rejected because:**
- Reinventing Observable interface
- Team must learn custom abstraction
- No ecosystem support
- Significantly more complex

### Alternative 3: Dual Interface (Promise + Observable)

```typescript
export interface AuthRepository {
  login(email: string, password: string): Observable<AuthUser>;
  loginAsync(email: string, password: string): Promise<AuthUser>;
}
```

**Rejected because:**
- API duplication
- Maintenance burden
- Confusing for developers
- No clear benefit

## Validation Checklist

- [x] Domain entities remain pure (no RxJS)
- [x] Only repository interfaces use Observable
- [x] Infrastructure implementations work seamlessly
- [x] Application stores integrate without conversion
- [x] Team understands the trade-off
- [x] Documentation is clear

## References

- [NgRx Signals Documentation](https://ngrx.io/guide/signals)
- [RxJS Best Practices](https://rxjs.dev/guide/overview)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)

## Review

This decision should be reviewed when:
1. Migrating to a different frontend framework
2. Major RxJS version changes introduce breaking changes
3. NgRx Signals deprecates rxMethod in favor of Promise-based methods
4. Team identifies significant pain points with Observable usage

**Next Review Date:** When migrating frameworks or major dependency updates

## Appendix: Code Examples

### ✅ Correct: Observable in Repository Interface

```typescript
// domain/repositories/task.repository.interface.ts
export interface TaskRepository {
  getTasks(workspaceId: string): Observable<Task[]>;
  getTask(id: string): Observable<Task | null>;
  createTask(task: Omit<Task, 'id'>): Observable<Task>;
  updateTask(id: string, updates: Partial<Task>): Observable<Task>;
  deleteTask(id: string): Observable<void>;
}
```

### ✅ Correct: Application Store Using Repository

```typescript
// application/tasks/stores/tasks.store.ts
export const TasksStore = signalStore(
  withMethods((store, taskRepository = inject(TASK_REPOSITORY)) => ({
    loadTasks: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((workspaceId) => taskRepository.getTasks(workspaceId)),
        tapResponse({
          next: (tasks) => patchState(store, { tasks, loading: false }),
          error: (error) => patchState(store, { error: error.message, loading: false })
        })
      )
    )
  }))
);
```

### ❌ Wrong: Promise with Manual Conversion

```typescript
// DON'T DO THIS
export const TasksStore = signalStore(
  withMethods((store, taskRepository = inject(TASK_REPOSITORY)) => ({
    loadTasks: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((workspaceId) => from(taskRepository.getTasks(workspaceId))), // ❌ Unnecessary conversion
        tapResponse({
          next: (tasks) => patchState(store, { tasks, loading: false }),
          error: (error) => patchState(store, { error: error.message, loading: false })
        })
      )
    )
  }))
);
```
