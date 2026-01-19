---
description: 'Configuration for AI behavior when implementing RxJS reactive patterns with proper subscription management'
applyTo: '**'
---

# RxJS Patterns Rules
Configuration for AI behavior when implementing RxJS reactive programming patterns

## CRITICAL: Subscription management is MANDATORY
- YOU MUST ALWAYS ensure observables are properly unsubscribed to prevent memory leaks
- When using observables in components:
  - BEST: Use `toSignal()` for automatic cleanup
  - GOOD: Use `takeUntil(destroy$)` pattern with proper cleanup in `ngOnDestroy()`
  - ACCEPTABLE: Use `AsyncPipe` in templates (auto-unsubscribes)
- MUST NOT manually subscribe without cleanup strategy
- > NOTE: Memory leaks from unclosed subscriptions are critical errors

## When choosing RxJS flattening operators
- Use `switchMap` when:
  - You need to cancel previous requests (search, autocomplete)
  - Only the latest result matters
- Use `mergeMap` when:
  - Operations can run concurrently
  - All results matter (independent operations)
- Use `concatMap` when:
  - Operations must run in sequence
  - Order is important (queued operations)
- Use `exhaustMap` when:
  - You want to ignore new requests while one is running
  - Example: save/submit buttons (prevent double-submission)
- > NOTE: Choosing wrong operator leads to race conditions or performance issues

## CRITICAL: Error handling is MANDATORY
- MUST handle errors in all observable streams
- Use `catchError` operator to handle errors gracefully
- Provide fallback values or retry logic:
  - `retry(n)`: retry failed operations n times
  - `catchError(() => of(fallbackValue))`: provide default value
- Log errors for debugging
- MUST NOT let errors propagate unhandled to break stream

## When converting between Observables and Signals
- Observable to Signal:
  - Use `toSignal(observable$, { initialValue: defaultValue })`
  - Provides automatic subscription cleanup
- Signal to Observable:
  - Use `toObservable(signal)`
  - Creates observable from signal changes
- EXAMPLE:
  - After: Creating a data service that returns Observable
  - Do: Convert to Signal with `toSignal()` in component
  - Before: Using in template or computed

## When implementing subscription cleanup pattern
- Create `destroy$` subject in component:
  ```typescript
  private destroy$ = new Subject<void>();
  ```
- Use `takeUntil(this.destroy$)` before subscribing
- In `ngOnDestroy()`:
  ```typescript
  this.destroy$.next();
  this.destroy$.complete();
  ```
- > NOTE: This pattern ensures all subscriptions are cleaned up

## When sharing expensive observables
- Use `shareReplay()` for expensive operations that should be cached
- Use `share()` for multicasting without replay
- Helps prevent duplicate HTTP requests or computations

## General
- Prefer `toSignal()` over manual subscription in components
- Use `AsyncPipe` in templates when signals are not suitable
- Choose flattening operators based on cancellation needs
- Always handle errors with `catchError`
- Use `takeUntil` pattern for manual subscriptions
- Test observable streams for memory leaks
- Document complex observable chains with comments
