---
description: 'Configuration for AI behavior when implementing GitHub Actions CI/CD pipelines for Angular applications'
applyTo: '**'
---

# GitHub Actions CI/CD Rules for Angular
Configuration for AI behavior when implementing CI/CD pipelines

## CRITICAL: Before creating ANY workflow
- YOU MUST implement CI/CD using **GitHub Actions** for Angular 20+ projects
- Pipeline MUST support:
  - `Material Design 3 + Angular Material/CDK` for UI
  - `NgRx Signals + AngularFire` for state/data management
  - Zone-less, fully reactive architecture
- Workflows MUST be modular, reusable, and maintainable
- > NOTE: Follow Single Responsibility Principle (SRP) for each workflow and job

## When designing workflow architecture
- Strictly follow **SRP** for workflows and jobs
- Ensure **clear separation of concerns**:
  - Build jobs separate from test jobs
  - Test jobs separate from deployment jobs
  - Linting separate from compilation
- Maintain **consistent naming**:
  - Workflows: `build-and-test.yml`, `deploy-prod.yml`
  - Jobs: descriptive names (`build`, `unit-test`, `e2e-test`, `deploy`)
- Refactor IMMEDIATELY if job blocks clarity or efficiency

## CRITICAL: Requirement analysis before implementation
- Translate needs into **atomic, verifiable pipeline steps**
- Use **sequential reasoning** for job execution order
- Any uncertainty MUST be clarified using official documentation
- MUST NOT implement steps without 100% correctness validation

## When decomposing CI/CD tasks
- Break down into three types:
  - **Atomic tasks**: single responsibility, small steps
  - **Sequential tasks**: use `needs` for execution order
  - **Actionable steps**: explicit commands with defined outputs
- EXAMPLE:
  - After: Requirement "deploy to production after tests pass"
  - Do: Create jobs: `build` → `test` → `deploy` with `needs` dependencies
  - Before: Implementing any workflow code

## CRITICAL: Implementation standards
- Jobs MUST be concise, deterministic, and reproducible
- Use official actions:
  - `actions/checkout`: for source code
  - `actions/setup-node`: for Node environment  
  - `firebase/actions` or similar: for deployment
  - `actions/cache`: for dependency caching
- Environment variables and secrets MUST be managed via GitHub repository secrets
- MUST NOT hardcode any secrets or credentials
- > NOTE: All secrets should use `${{ secrets.SECRET_NAME }}` syntax

## When ensuring build quality
- MUST ensure **TypeScript compiles cleanly** with `tsc --noEmit`
- MUST verify **Angular AOT builds** succeed
- MUST run **unit and integration tests** automatically
- Linting and formatting MUST pass before merging:
  - Run `eslint` for code quality
  - Run `prettier` for code formatting
- All quality gates MUST be enforced in CI

## When optimizing performance
- Integrate caching with `actions/cache`:
  - Cache `node_modules` based on `package-lock.json` hash
  - Cache build artifacts when appropriate
  - Set proper cache keys and restore keys
- Use matrix strategies for parallel testing
- Minimize workflow execution time

## When documenting pipelines
- Log pipeline outcomes and failed steps
- Maintain structured documentation:
  - Job purpose and responsibilities
  - Dependencies between jobs
  - Environment setup requirements
- Accumulate context for future automation and error prevention
- > NOTE: Documentation helps with troubleshooting and onboarding

## General
- Use GitHub Actions for all CI/CD
- Support Angular 20+ with modern architecture
- Follow SRP for workflows and jobs
- Ensure clear separation of concerns
- Use official actions from marketplace
- Manage secrets via repository secrets
- Cache dependencies for performance
- Enforce all quality gates in CI
- Document pipeline structure and requirements
- Validate correctness before implementation
