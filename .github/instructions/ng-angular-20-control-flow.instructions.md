---
description: 'Angular 20 built-in control flow (@if, @for, @switch, @defer) best practices for modern template syntax with better performance and type safety'
applyTo: '**/*.html, **/*.ts'
---

# Angular 20 Control Flow Guidelines

## Overview

Angular 20 introduces built-in control flow syntax that replaces structural directives (*ngIf, *ngFor, *ngSwitch) with better performance, type safety, and developer experience.

## Core Syntax

### @if - Conditional Rendering

```typescript
// ✅ Good - Use @if with signals
@if (user()) {
  <div>Welcome, {{ user()!.name }}!</div>
} @else {
  <app-login />
}

// ✅ Good - Type narrowing with 'as'
@if (data(); as currentData) {
  <div>{{ currentData.title }}</div>
}

// ✅ Good - Multiple conditions
@if (status() === 'loading') {
  <app-spinner />
} @else if (status() === 'error') {
  <app-error [message]="errorMessage()" />
} @else if (status() === 'success') {
  <app-content [data]="data()" />
} @else {
  <app-empty-state />
}
```

### @for - List Iteration

```typescript
// ✅ Good - Always use track
@for (item of items(); track item.id) {
  <app-item-card [item]="item" />
}

// ✅ Good - Use context variables
@for (item of items(); track item.id; let idx = $index, first = $first, last = $last) {
  <div [class.first]="first" [class.last]="last">
    {{ idx + 1 }}. {{ item.name }}
  </div>
}

// ✅ Good - Handle empty state
@for (product of products(); track product.id) {
  <app-product-card [product]="product" />
} @empty {
  <div class="empty-state">
    <p>No products available</p>
    <button (click)="loadProducts()">Refresh</button>
  </div>
}

// ❌ Bad - Missing track (will error)
@for (item of items()) {
  <div>{{ item.name }}</div>
}
```

### @switch - Multi-branch Conditionals

```typescript
// ✅ Good - Use @switch for multiple conditions
@switch (userRole()) {
  @case ('admin') {
    <app-admin-panel />
  }
  @case ('moderator') {
    <app-moderator-panel />
  }
  @case ('user') {
    <app-user-panel />
  }
  @default {
    <app-guest-panel />
  }
}
```

### @defer - Lazy Loading

```typescript
// ✅ Good - Defer heavy components
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <div class="chart-skeleton"></div>
} @loading (minimum 500ms) {
  <mat-spinner></mat-spinner>
} @error {
  <div>Failed to load chart</div>
}

// ✅ Good - Defer with prefetch
@defer (on viewport; prefetch on idle) {
  <app-article-content />
}

// ✅ Good - Multiple triggers
@defer (on hover; on viewport) {
  <app-tooltip-content />
}
```

## Best Practices

### 1. Always Use Signals with Control Flow

```typescript
// ✅ Good - Reactive with signals
export class Component {
  items = signal<Item[]>([]);
  isLoading = signal(false);
  
  template = `
    @if (isLoading()) {
      <spinner />
    } @else {
      @for (item of items(); track item.id) {
        <item-card [item]="item" />
      }
    }
  `;
}

// ❌ Bad - Non-reactive properties
export class Component {
  items: Item[] = [];
  isLoading = false;
}
```

### 2. Track By Unique Identifiers

```typescript
// ✅ Good - Track by ID
@for (user of users(); track user.id) {
  <user-card [user]="user" />
}

// ✅ Good - Track by index for static lists
@for (tab of tabs; track $index) {
  <button>{{ tab }}</button>
}

// ❌ Bad - Track by object reference
@for (item of items(); track item) {
  <div>{{ item.name }}</div>
}
```

### 3. Use Type Narrowing

```typescript
// ✅ Good - Type narrowing with 'as'
@if (user(); as currentUser) {
  <!-- currentUser is guaranteed non-null -->
  <div>{{ currentUser.email }}</div>
  <div>{{ currentUser.displayName }}</div>
}

// ❌ Bad - Repeated null checks
@if (user()) {
  <div>{{ user()!.email }}</div>
  <div>{{ user()!.displayName }}</div>
}
```

### 4. Leverage @empty for Better UX

```typescript
// ✅ Good - Provide empty state
@for (item of items(); track item.id) {
  <item-card [item]="item" />
} @empty {
  <empty-state 
    message="No items found" 
    [showAction]="true"
    (action)="createItem()" />
}

// ❌ Bad - No empty state handling
@for (item of items(); track item.id) {
  <item-card [item]="item" />
}
```

### 5. Strategic Deferred Loading

```typescript
// ✅ Good - Defer below-the-fold content
@defer (on viewport) {
  <app-comments-section />
}

// ✅ Good - Defer analytics
@defer (on idle) {
  <app-analytics-tracker />
}

// ✅ Good - Defer on interaction
@defer (on interaction) {
  <app-modal-content />
}

// ✅ Good - Time-delayed content
@defer (on timer(5s)) {
  <app-promotional-banner />
}
```

## Advanced Patterns

### Nested Control Flow

```typescript
@if (data(); as currentData) {
  @for (category of currentData.categories; track category.id) {
    <div class="category">
      <h3>{{ category.name }}</h3>
      @for (item of category.items; track item.id) {
        <div class="item">{{ item.title }}</div>
      } @empty {
        <p>No items in this category</p>
      }
    </div>
  } @empty {
    <p>No categories available</p>
  }
}
```

### Conditional Deferred Loading

```typescript
@if (shouldLoadHeavyComponent()) {
  @defer (on viewport) {
    <app-heavy-component [config]="config()" />
  } @loading (minimum 1s) {
    <skeleton-loader />
  }
}
```

### Complex State Management

```typescript
@switch (appState()) {
  @case ('initializing') {
    <app-splash-screen />
  }
  @case ('loading') {
    <app-loading-indicator />
  }
  @case ('ready') {
    @if (hasData()) {
      @for (item of data(); track item.id) {
        <app-data-item [item]="item" />
      } @empty {
        <app-no-data />
      }
    } @else {
      <app-empty-state />
    }
  }
  @case ('error') {
    <app-error-display [error]="error()" />
  }
  @default {
    <app-unknown-state />
  }
}
```

## Migration from Old Syntax

### *ngIf → @if

```typescript
// Before
<div *ngIf="isVisible">Content</div>
<div *ngIf="user; else loading">{{ user.name }}</div>

// After
@if (isVisible()) {
  <div>Content</div>
}

@if (user(); as currentUser) {
  <div>{{ currentUser.name }}</div>
} @else {
  <ng-template [ngTemplateOutlet]="loading" />
}
```

### *ngFor → @for

```typescript
// Before
<li *ngFor="let item of items; trackBy: trackById; let i = index">
  {{ i + 1 }}. {{ item.name }}
</li>

// After
@for (item of items(); track item.id; let idx = $index) {
  <li>{{ idx + 1 }}. {{ item.name }}</li>
}
```

### *ngSwitch → @switch

```typescript
// Before
<div [ngSwitch]="status">
  <div *ngSwitchCase="'success'">Success!</div>
  <div *ngSwitchCase="'error'">Error!</div>
  <div *ngSwitchDefault>Loading...</div>
</div>

// After
@switch (status()) {
  @case ('success') {
    <div>Success!</div>
  }
  @case ('error') {
    <div>Error!</div>
  }
  @default {
    <div>Loading...</div>
  }
}
```

## Performance Considerations

### 1. Minimize Re-renders

```typescript
// ✅ Good - Stable track function
@for (item of items(); track item.id) {
  <item-card [item]="item" />
}

// ❌ Bad - Unstable tracking
@for (item of items(); track getItemId(item)) {
  <item-card [item]="item" />
}
```

### 2. Defer Heavy Components

```typescript
// ✅ Good - Lazy load heavy components
@defer (on viewport) {
  <app-complex-visualization [data]="chartData()" />
} @placeholder (minimum 200ms) {
  <div class="viz-placeholder"></div>
}
```

### 3. Use Minimum Loading Times

```typescript
// ✅ Good - Prevent loading flicker
@defer (on viewport) {
  <app-content />
} @loading (minimum 500ms) {
  <spinner />
}
```

## Common Pitfalls

### 1. Missing Track Expression

```typescript
// ❌ Error - track is required
@for (item of items()) {
  <div>{{ item.name }}</div>
}

// ✅ Fixed
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

### 2. Incorrect Empty State Handling

```typescript
// ❌ Bad - Using undefined instead of empty array
items = signal<Item[] | undefined>(undefined);

// ✅ Good - Use empty array
items = signal<Item[]>([]);
```

### 3. Over-nesting Control Flow

```typescript
// ❌ Bad - Too deeply nested
@if (a()) {
  @if (b()) {
    @if (c()) {
      @if (d()) {
        <div>Content</div>
      }
    }
  }
}

// ✅ Good - Use computed signals
showContent = computed(() => a() && b() && c() && d());

@if (showContent()) {
  <div>Content</div>
}
```

## Testing

```typescript
describe('Component with Control Flow', () => {
  it('should show content when condition is true', () => {
    component.isVisible.set(true);
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('.content')).toBeTruthy();
  });
  
  it('should render all items', () => {
    component.items.set([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]);
    fixture.detectChanges();
    
    const items = fixture.nativeElement.querySelectorAll('.item');
    expect(items.length).toBe(2);
  });
});
```

## Resources

- [Angular Control Flow Guide](https://angular.dev/guide/templates/control-flow)
- [Angular Defer Guide](https://angular.dev/guide/defer)
- [Migration Guide](https://angular.dev/reference/migrations/control-flow)
