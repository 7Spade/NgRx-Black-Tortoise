---
description: 'Domain-Driven Design patterns with clean architecture layers for Angular applications'
applyTo: 'src/app/domain/**/*.ts, src/app/infrastructure/**/*.ts, src/app/application/**/*.ts'
---

# Domain-Driven Design Guidelines

## Layer Dependencies

```
Presentation → Application → Domain
Infrastructure → Domain (implements interfaces)
```

## Domain Layer Rules

- ✅ Pure TypeScript (no Angular dependencies)
- ✅ Define entities with identity and behavior
- ✅ Use value objects for validation
- ✅ Raise domain events for state changes
- ✅ Define repository interfaces
- ❌ No framework dependencies
- ❌ No I/O operations
- ❌ No anemic models

## Entity Pattern

```typescript
export class Workspace {
  private _id: WorkspaceId;
  private _name: WorkspaceName;
  
  static create(props: { name: string }): Workspace {
    const workspace = new Workspace(/*...*/);
    workspace.addDomainEvent(new WorkspaceCreatedEvent(/*...*/));
    return workspace;
  }
  
  rename(newName: string): void {
    this._name = WorkspaceName.create(newName);
    this.addDomainEvent(new WorkspaceRenamedEvent(/*...*/));
  }
}
```

## Value Object Pattern

```typescript
export class WorkspaceName {
  private constructor(private readonly _value: string) {}
  
  static create(value: string): WorkspaceName {
    if (!value || value.length > 100) {
      throw new Error('Invalid workspace name');
    }
    return new WorkspaceName(value);
  }
  
  get value(): string { return this._value; }
  equals(other: WorkspaceName): boolean { return this._value === other._value; }
}
```

## Repository Pattern

```typescript
// Domain layer - interface
export interface IWorkspaceRepository {
  findById(id: WorkspaceId): Observable<Workspace | null>;
  save(workspace: Workspace): Observable<Workspace>;
}

// Infrastructure layer - implementation
@Injectable({ providedIn: 'root' })
export class WorkspaceFirestoreRepository implements IWorkspaceRepository {
  // Implementation
}
```
