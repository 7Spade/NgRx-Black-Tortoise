---
description: 'Configuration for AI behavior when writing TypeScript 5.x code targeting ES2022 output'
applyTo: '**'
---

# TypeScript 5.x Development Rules
Configuration for AI behavior when generating TypeScript code

> These rules assume TypeScript 5.x (or newer) compiling to ES2022 JavaScript baseline.

## CRITICAL: Core development principles
- MUST respect existing architecture and coding standards
- MUST prefer readable, explicit solutions over clever shortcuts
- MUST extend current abstractions before inventing new ones
- MUST prioritize maintainability and clarity
- Write short methods and classes with clear responsibilities
- > NOTE: Clean code principles apply to all TypeScript development

## When organizing project structure
- Follow repository's folder and responsibility layout for new code
- Use kebab-case filenames: `user-session.ts`, `data-service.ts`
- Keep tests, types, and helpers near their implementation
- Reuse or extend shared utilities before adding new ones
- MUST NOT create duplicate utilities when existing ones can be extended

## CRITICAL: TypeScript and ES2022 standards
- Target TypeScript 5.x / ES2022
- Use pure ES modules:
  - MUST NOT emit `require`, `module.exports`, or CommonJS helpers
  - Use `import` and `export` only
- Prefer native features over polyfills
- Rely on project's build, lint, and test scripts unless asked otherwise
- Note design trade-offs when intent is not obvious

## When naming code elements
- Use `PascalCase` for:
  - Classes
  - Interfaces  
  - Enums
  - Type aliases
- Use `camelCase` for:
  - Variables
  - Functions
  - Methods
  - Parameters
- MUST NOT use interface prefixes like `I` (bad: `IUser`, good: `User`)
- Name for behavior or domain meaning, not implementation

## When writing and formatting code
- Run repository's lint/format scripts before submitting: `npm run lint`
- Match project's style:
  - Indentation (spaces/tabs)
  - Quote style (single/double)
  - Trailing comma rules
- Keep functions focused on single responsibility
- Extract helpers when logic branches grow
- Favor immutable data and pure functions when practical

## CRITICAL: Type system requirements
- MUST avoid `any` (implicit or explicit)
- Use `unknown` plus type narrowing instead of `any`
- Use discriminated unions for:
  - Realtime events
  - State machines  
  - Variant types
- Centralize shared contracts instead of duplicating shapes
- Express intent with utility types:
  - `Readonly<T>`: immutable types
  - `Partial<T>`: optional properties
  - `Record<K, V>`: key-value mappings
  - `Pick<T, K>`, `Omit<T, K>`: type transformations
- > NOTE: Strong typing prevents runtime errors

## When handling async operations and errors
- Use `async/await` for asynchronous code
- Wrap awaits in try/catch with structured errors:
  ```typescript
  try {
    const result = await operation();
  } catch (error) {
    // Handle with structured error
    throw new OperationError('Failed to...', { cause: error });
  }
  ```
- Guard edge cases early to avoid deep nesting
- Send errors through project's logging/telemetry utilities
- Surface user-facing errors via repository's notification pattern
- Debounce configuration-driven updates
- Dispose resources deterministically

## When implementing architecture patterns
- Follow repository's dependency injection or composition pattern
- Keep modules single-purpose
- Observe existing initialization and disposal sequences
- Keep layers decoupled with clear interfaces:
  - Transport layer
  - Domain layer
  - Presentation layer
- Supply lifecycle hooks when adding services:
  - `initialize()`
  - `dispose()`
- Add targeted tests for new services

## When integrating with external systems
- Instantiate clients outside hot paths
- Inject clients for testability
- MUST NOT hardcode secrets (load from secure sources)
- Apply retries, backoff, and cancellation to network/IO calls
- Normalize external responses
- Map errors to domain shapes
- > NOTE: External integrations should be resilient and testable

## CRITICAL: Security practices
- MUST validate and sanitize external input:
  - Use schema validators
  - Use type guards
- MUST NOT use dynamic code execution
- MUST NOT use untrusted template rendering
- Encode untrusted content before rendering HTML:
  - Use framework escaping
  - Use trusted types
- Use parameterized queries or prepared statements (prevent injection)
- Keep secrets in secure storage:
  - Rotate regularly
  - Request least-privilege scopes
- Favor immutable flows and defensive copies for sensitive data
- Use vetted crypto libraries only
- Patch dependencies promptly
- Monitor security advisories

## When managing configuration and secrets
- Access configuration through shared helpers
- Validate with schemas or dedicated validators
- Handle secrets via project's secure storage
- Guard `undefined` and error states
- Document new configuration keys
- Update related tests when adding config
- MUST NOT commit secrets to version control

## When building UI/UX components
- Sanitize user or external content before rendering
- Keep UI layers thin
- Push heavy logic to services or state managers
- Use messaging or events to decouple UI from business logic
- > NOTE: UI should be presentation-focused, not logic-heavy

## When writing tests
- Add or update unit tests with project's framework
- Match project's testing naming style
- Expand integration/e2e tests when behavior crosses modules
- Run targeted test scripts for quick feedback
- MUST avoid brittle timing assertions:
  - Use fake timers
  - Use injected clocks
  - Never rely on real delays

## When optimizing performance
- Lazy-load heavy dependencies
- Dispose dependencies when done
- Defer expensive work until users need it
- Batch or debounce high-frequency events to reduce thrash
- Track resource lifetimes to prevent leaks
- Profile before optimizing (measure first)

## When documenting code
- Add JSDoc to public APIs:
  - Include `@param` for parameters
  - Include `@returns` for return values
  - Include `@throws` for exceptions
  - Include `@remarks` or `@example` when helpful
- Write comments that capture INTENT (why), not mechanics (what)
- Remove stale notes during refactors
- Update architecture or design docs when introducing significant patterns
- > NOTE: Good documentation explains WHY, not WHAT

## General
- Target TypeScript 5.x / ES2022 with pure ES modules
- Respect existing architecture and standards
- Use kebab-case filenames and proper naming conventions
- Avoid `any` - use `unknown` with type narrowing
- Use `async/await` with structured error handling
- Never hardcode secrets
- Validate and sanitize all external input
- Keep UI layers thin
- Write focused, tested, well-documented code
- Lazy-load and dispose resources properly
- Add JSDoc to public APIs
