---
description: 'Firebase Data Connect GraphQL integration with type-safe SDKs and PostgreSQL backend for Angular applications'
applyTo: 'dataconnect/**/*.gql, src/dataconnect-generated/**/*.ts, **/data-connect*.ts'
---

# Firebase Data Connect Development Guidelines

## Core Principles

- Use GraphQL for type-safe data access
- Define schemas in `.gql` files
- Generate TypeScript SDKs automatically
- Integrate with NgRx Signals stores
- Follow repository pattern for data access
- Implement proper authentication and authorization

## Schema Design

```graphql
# Define tables with proper relationships
type Entity @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @unique
  createdAt: Timestamp! @default(expr: "request.time")
}
```

## Integration with NgRx Signals

```typescript
// Use generated SDK in stores
withMethods((store, dataConnect = inject(DataConnectService)) => ({
  loadData: rxMethod<string>(
    pipe(
      switchMap((id) => dataConnect.getData(id)),
      tapResponse({
        next: (data) => patchState(store, { data }),
        error: (error) => patchState(store, { error: error.message })
      })
    )
  )
}))
```

## Best Practices

- ✅ Generate SDKs after schema changes
- ✅ Use @auth directives for security
- ✅ Request only needed fields in queries
- ✅ Implement proper error handling
- ❌ Don't over-fetch data
- ❌ Don't skip input validation
