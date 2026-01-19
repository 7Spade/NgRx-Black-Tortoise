---
description: 'NgRx Signals state management best practices for pure reactive Angular applications. Use signalStore, computed, patchState, and rxMethod only. No traditional NgRx patterns.'
applyTo: '**'
---

# NgRx Signals State Management

## Overview

NgRx Signals provides pure reactive state management for Angular applications using Angular Signals. This is the **ONLY** state management approach allowed in this project.

## Core Principles

This project uses **ONLY** `@ngrx/signals` for state management. Traditional NgRx (actions, reducers, effects) is **FORBIDDEN**.

### Pure Reactive Principles

```
SignalsPrinciple = PureReactivity (
  NoSideEffectInComputed | 
  ImmutableState | 
  UnidirectionalDataFlow | 
  DerivedStateFromSignals
)
```

**Core Rules**
- ✅ All state managed with `signalStore`
- ✅ All mutations via `patchState`
- ✅ All derived state via `computed()`
- ✅ All async operations via `rxMethod`
- ❌ NO traditional NgRx (actions, reducers, effects)
- ❌ NO RxJS operators for state management
- ❌ NO direct state mutation
- ❌ NO side effects in computed signals

## Store Structure

### Basic Store Template

```typescript
import { signalStore, withState, withComputed, withMethods, withHooks } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

// 1. Define State Interface
export interface FeatureState {
  // Data
  entities: Entity[];
  selectedId: string | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Filters/Sorting
  filters: Filters;
  sorting: Sorting;
}

// 2. Initial State
const initialState: FeatureState = {
  entities: [],
  selectedId: null,
  loading: false,
  error: null,
  filters: {},
  sorting: { field: 'createdAt', order: 'desc' }
};

// 3. Create Store
export const FeatureStore = signalStore(
  // Provide in root for singleton, or omit for scoped
  { providedIn: 'root' },
  
  // State
  withState(initialState),
  
  // Computed (Derived State)
  withComputed(({ entities, selectedId, filters, sorting }) => ({
    // Simple computed
    entityCount: computed(() => entities().length),
    
    // Computed with dependency
    selectedEntity: computed(() => 
      entities().find(e => e.id === selectedId()) ?? null
    ),
    
    // Complex computed (filtering + sorting)
    filteredEntities: computed(() => {
      let result = entities();
      
      // Apply filters
      const f = filters();
      if (f.search) {
        result = result.filter(e => 
          e.name.toLowerCase().includes(f.search!.toLowerCase())
        );
      }
      
      // Apply sorting
      const s = sorting();
      result = [...result].sort((a, b) => {
        const aVal = a[s.field];
        const bVal = b[s.field];
        return s.order === 'asc' 
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1;
      });
      
      return result;
    }),
    
    // Boolean computed
    hasSelection: computed(() => selectedId() !== null),
    isEmpty: computed(() => entities().length === 0)
  })),
  
  // Methods (Mutations + Effects)
  withMethods((store, service = inject(FeatureService)) => ({
    // Simple mutation
    selectEntity(id: string | null) {
      patchState(store, { selectedId: id });
    },
    
    // Mutation with transformation
    setFilters(filters: Partial<Filters>) {
      patchState(store, (state) => ({
        filters: { ...state.filters, ...filters }
      }));
    },
    
    // Async effect with rxMethod
    loadEntities: rxMethod<string>(
      pipe(
        // Set loading state
        tap(() => patchState(store, { loading: true, error: null })),
        
        // Call service
        switchMap((workspaceId) => service.getEntities(workspaceId)),
        
        // Handle response
        tapResponse({
          next: (entities) => patchState(store, { 
            entities, 
            loading: false 
          }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    // Optimistic update
    addEntity: rxMethod<Entity>(
      pipe(
        tap((entity) => {
          // Optimistically add to state
          patchState(store, (state) => ({
            entities: [...state.entities, entity]
          }));
        }),
        switchMap((entity) => service.createEntity(entity)),
        tapResponse({
          next: (savedEntity) => {
            // Replace optimistic entity with saved one
            patchState(store, (state) => ({
              entities: state.entities.map(e => 
                e.id === savedEntity.id ? savedEntity : e
              )
            }));
          },
          error: (error: Error) => {
            // Rollback on error
            patchState(store, (state) => ({
              entities: state.entities.filter(e => e.id !== entity.id),
              error: error.message
            }));
          }
        })
      )
    )
  })),
  
  // Lifecycle Hooks
  withHooks({
    onInit(store) {
      // Auto-load on init
      const contextStore = inject(ContextStore);
      effect(() => {
        const workspaceId = contextStore.currentWorkspaceId();
        if (workspaceId) {
          store.loadEntities(workspaceId);
        }
      });
    },
    
    onDestroy() {
      // Cleanup if needed
      console.log('Store destroyed');
    }
  })
);
```

## State Management Patterns

### 1. State Definition

```typescript
// ✅ Good - Complete state interface
interface TaskState {
  tasks: Task[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
}

// ✅ Good - Initialize all fields
const initialState: TaskState = {
  tasks: [],
  selectedId: null,
  loading: false,
  error: null,
  filters: {}
};

// ❌ Bad - Undefined fields
const initialState = {
  tasks: [],
  selectedId: undefined, // Use null instead
  loading: undefined      // Use false instead
};
```

### 2. Computed Signals

```typescript
// ✅ Good - Pure computed
withComputed(({ tasks, selectedId, filters }) => ({
  filteredTasks: computed(() => {
    let result = tasks();
    if (filters().status) {
      result = result.filter(t => t.status === filters().status);
    }
    return result;
  }),
  
  selectedTask: computed(() => 
    tasks().find(t => t.id === selectedId()) ?? null
  )
}))

// ❌ Bad - Side effects in computed
withComputed(() => ({
  tasks: computed(() => {
    this.service.logAccess(); // ❌ Side effect!
    return this.tasks();
  })
}))
```

### 3. Methods and Mutations

```typescript
// ✅ Good - All mutations via patchState
withMethods((store) => ({
  setSelection(id: string | null) {
    patchState(store, { selectedId: id });
  },
  
  updateFilters(filters: Partial<Filters>) {
    patchState(store, (state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },
  
  clearFilters() {
    patchState(store, { filters: {}, searchTerm: '' });
  }
}))

// ❌ Bad - Direct mutation
withMethods((store) => ({
  setSelection(id: string) {
    store.selectedId = id; // ❌ Direct mutation!
  }
}))
```

### 4. Async Operations with rxMethod

```typescript
// ✅ Good - rxMethod for async
withMethods((store, service = inject(TaskService)) => ({
  loadTasks: rxMethod<string>(
    pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap((workspaceId) => service.getTasks(workspaceId)),
      tapResponse({
        next: (tasks) => patchState(store, { tasks, loading: false }),
        error: (error: Error) => patchState(store, { 
          error: error.message, 
          loading: false 
        })
      })
    )
  ),
  
  deleteTask: rxMethod<string>(
    pipe(
      switchMap((id) => service.deleteTask(id)),
      tapResponse({
        next: (deletedId) => patchState(store, (state) => ({
          tasks: state.tasks.filter(t => t.id !== deletedId),
          selectedId: state.selectedId === deletedId ? null : state.selectedId
        })),
        error: (error: Error) => patchState(store, { error: error.message })
      })
    )
  )
}))

// ❌ Bad - async/await without rxMethod
async loadTasks() {
  const tasks = await this.service.getTasks(); // ❌
  this.tasks = tasks; // ❌
}
```

## RxJS Operator Selection

```typescript
// Use switchMap - Cancel previous, use for search/filters
loadData: rxMethod<string>(
  pipe(switchMap((query) => service.search(query)))
)

// Use mergeMap - Run concurrently, use for independent operations
logEvent: rxMethod<Event>(
  pipe(mergeMap((event) => analytics.log(event)))
)

// Use concatMap - Queue sequentially, use for ordered operations
saveItems: rxMethod<Item>(
  pipe(concatMap((item) => service.save(item)))
)

// Use exhaustMap - Ignore new while running, use for save/submit
submit: rxMethod<Form>(
  pipe(exhaustMap((form) => service.submit(form)))
)
```

## Error Handling

```typescript
// ✅ Good - Always use tapResponse
tapResponse({
  next: (result) => {
    patchState(store, { result, loading: false });
  },
  error: (error: Error) => {
    console.error('Operation failed:', error);
    patchState(store, { error: error.message, loading: false });
  }
})

// ❌ Bad - catchError in rxMethod
pipe(
  switchMap(() => service.getData()),
  catchError((error) => {
    // ❌ Don't use catchError
    return of(null);
  })
)
```

## Lifecycle Hooks

```typescript
withHooks({
  onInit(store) {
    // Auto-load data
    store.loadData();
    
    // React to other stores
    const authStore = inject(AuthStore);
    effect(() => {
      const user = authStore.user();
      if (user) {
        store.loadUserData(user.uid);
      } else {
        patchState(store, initialState);
      }
    });
    
    // Watch workspace changes
    const contextStore = inject(ContextStore);
    effect(() => {
      const workspaceId = contextStore.currentWorkspaceId();
      if (workspaceId) {
        patchState(store, initialState);
        store.loadWorkspaceData(workspaceId);
      }
    });
  },
  
  onDestroy(store) {
    // Cleanup (rxMethod handles subscriptions automatically)
    console.log('Store destroyed');
  }
})
```

## Store Types by Layer

### GlobalShell Store

```typescript
export const GlobalShellStore = signalStore(
  { providedIn: 'root' },
  withState({
    config: null as Config | null,
    layout: 'default' as Layout,
    theme: 'light' as Theme
  }),
  withComputed(({ theme }) => ({
    isDarkTheme: computed(() => theme() === 'dark')
  })),
  withMethods((store) => ({
    toggleTheme() {
      patchState(store, (state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      }));
    }
  }))
);
```

### Feature Store

```typescript
export const TasksStore = signalStore(
  { providedIn: 'root' },
  withState({
    tasks: [] as Task[],
    selectedTaskId: null as string | null,
    filters: {} as TaskFilters,
    loading: false,
    error: null as string | null
  }),
  withComputed(({ tasks, filters }) => ({
    filteredTasks: computed(() => {
      let result = tasks();
      if (filters().status) {
        result = result.filter(t => t.status === filters().status);
      }
      return result;
    })
  })),
  withMethods((store, taskService = inject(TaskService)) => ({
    loadTasks: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((workspaceId) => taskService.getTasks(workspaceId)),
        tapResponse({
          next: (tasks) => patchState(store, { tasks, loading: false }),
          error: (error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    )
  }))
);
```

## Usage in Components

```typescript
@Component({
  selector: 'app-task-list',
  template: `
    @if (tasksStore.loading()) {
      <mat-spinner />
    } @else if (tasksStore.error()) {
      <app-error [message]="tasksStore.error()!" />
    } @else {
      @for (task of tasksStore.filteredTasks(); track task.id) {
        <app-task-item [task]="task" />
      }
    }
  `
})
export class TaskListComponent {
  tasksStore = inject(TasksStore);
  
  selectTask(id: string) {
    this.tasksStore.selectTask(id);
  }
}
```

## Testing Stores

```typescript
describe('TasksStore', () => {
  let store: InstanceType<typeof TasksStore>;
  let mockService: jasmine.SpyObj<TaskService>;
  
  beforeEach(() => {
    mockService = jasmine.createSpyObj('TaskService', ['getTasks']);
    TestBed.configureTestingModule({
      providers: [
        TasksStore,
        { provide: TaskService, useValue: mockService }
      ]
    });
    store = TestBed.inject(TasksStore);
  });
  
  it('should load tasks', (done) => {
    const mockTasks = [{ id: '1', name: 'Test' }];
    mockService.getTasks.and.returnValue(of(mockTasks));
    
    store.loadTasks('workspace-1');
    
    setTimeout(() => {
      expect(store.tasks()).toEqual(mockTasks);
      expect(store.loading()).toBe(false);
      done();
    }, 100);
  });
});
```

## Related Documentation

- [NgRx Signals Architecture](../../docs/architecture/07-ngrx-signals.md)
- [DDD Architecture](./ddd-architecture.instructions.md)
- [Angular Instructions](./angular.instructions.md)
