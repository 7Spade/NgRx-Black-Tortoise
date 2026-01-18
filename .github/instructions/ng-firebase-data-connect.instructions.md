---
description: 'Configuration for AI behavior when implementing Firebase Data Connect with GraphQL schemas and type-safe SDKs'
applyTo: '**'
---

# Firebase Data Connect Rules
Configuration for AI behavior when implementing Firebase Data Connect

## CRITICAL: Generate SDKs after schema changes
- YOU MUST regenerate TypeScript SDKs after ANY GraphQL schema changes:
  - Run: `firebase dataconnect:sdk:generate`
  - Generated files location: `src/dataconnect-generated/`
  - MUST NOT manually edit generated SDK files
- Verify SDK imports after generation
- Update store integrations if SDK signatures change
- > NOTE: Outdated SDKs cause type mismatches and runtime errors

## When defining GraphQL schemas
- Create `.gql` files in `dataconnect/` directory
- Define tables with proper type annotations:
  ```graphql
  type Entity @table {
    id: UUID! @default(expr: "uuidV4()")
    name: String! @unique
    createdAt: Timestamp! @default(expr: "request.time")
  }
  ```
- Use directives:
  - `@table`: marks type as database table
  - `@unique`: ensures field uniqueness
  - `@default`: sets default value with expression
  - `@auth`: defines authorization rules
- Define relationships between entities

## CRITICAL: Implement authentication and authorization
- MUST use `@auth` directive for security:
  ```graphql
  type PrivateData @table @auth(
    rules: [
      { allow: OWNER, ownerField: "userId" },
      { allow: ADMIN }
    ]
  ) {
    userId: UUID!
    content: String!
  }
  ```
- Define who can read, write, or delete data
- Implement owner-based access control
- Test authorization rules thoroughly

## When integrating with NgRx Signals
- Use generated SDK in stores via dependency injection
- Wrap Data Connect calls in `rxMethod`:
  ```typescript
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
- Handle loading and error states
- Cache query results when appropriate

## When designing queries and mutations
- Request only needed fields (avoid over-fetching):
  ```graphql
  query GetUser($id: UUID!) {
    user(id: $id) {
      name
      email
      # Don't fetch unnecessary fields
    }
  }
  ```
- Use query variables for parameterized queries
- Implement proper input validation
- Handle errors gracefully

## General
- Define schemas in `.gql` files
- Regenerate SDKs after schema changes
- Use `@auth` directives for security
- Request only needed fields in queries
- Integrate with NgRx Signals stores
- Implement proper error handling
- Follow repository pattern for data access
- Test queries and mutations thoroughly
- Validate inputs before sending to backend
