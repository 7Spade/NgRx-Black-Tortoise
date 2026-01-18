---
description: 'RxJS reactive programming patterns with proper subscription management and memory leak prevention'
applyTo: '**/*.ts'
---

# RxJS Development Guidelines

## Core Principles

- Always unsubscribe or use takeUntil
- Use toSignal for automatic cleanup
- Choose correct flattening operator
- Handle errors with catchError
- Share expensive observables

## Subscription Management

```typescript
// ✅ BEST - Use toSignal
data = toSignal(this.dataService.getData(), { initialValue: [] });

// ✅ GOOD - takeUntil pattern
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.getData().pipe(
    takeUntil(this.destroy$)
  ).subscribe(/*...*/);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## Operator Selection

```typescript
// switchMap - Cancel previous (search, autocomplete)
searchTerm$.pipe(
  debounceTime(300),
  switchMap(term => this.search(term))
)

// mergeMap - Run concurrently (independent operations)
ids$.pipe(
  mergeMap(id => this.loadItem(id))
)

// concatMap - Queue sequentially (ordered operations)
requests$.pipe(
  concatMap(req => this.process(req))
)

// exhaustMap - Ignore new while running (save, submit)
save$.pipe(
  exhaustMap(() => this.save(data))
)
```

## Error Handling

```typescript
this.http.get('/api/data').pipe(
  retry(3),
  catchError(error => {
    console.error('Error:', error);
    return of([]); // Fallback value
  })
)
```

## Integration with Signals

```typescript
// Observable to Signal
data = toSignal(this.dataService.getData(), { initialValue: [] });

// Signal to Observable
searchTerm = signal('');
results$ = toObservable(this.searchTerm).pipe(
  debounceTime(300),
  switchMap(term => this.search(term))
);
```
