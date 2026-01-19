---
applyTo: '.github/workflows/*.yml,.github/workflows/*.yaml'
description: 'Comprehensive guide for building robust, secure, and efficient CI/CD pipelines using GitHub Actions. Covers workflow structure, jobs, steps, environment variables, secret management, caching, matrix strategies, testing, and deployment strategies.'
---

# Modern Angular CI/CD Pipeline Guidelines

## 1. Workflow Architecture & Technology Stack

- Use **GitHub Actions** to implement CI/CD for Angular 20+ projects.
- The pipeline should support:
  - **Material Design 3 + Angular Material/CDK** for UI consistency
  - **NgRx Signals + AngularFire** for state and data management
  - Zone-less, fully reactive architecture
- Workflows should be modular, reusable, and maintainable.

## 2. Core Design Principles

- Strictly follow **Single Responsibility Principle (SRP)** for each workflow and job.
- Ensure **clear separation of concerns** between build, test, and deployment steps.
- Maintain **consistent naming and folder structure** for workflows.
- Refactor steps immediately if an existing job or action blocks clarity or efficiency.

## 3. Requirement Analysis & Validation

- Translate user/developer needs into **atomic, verifiable pipeline steps**.
- Use **sequential reasoning** to ensure jobs execute in a logical, validated order.
- Any uncertainty should be clarified using official documentation or context references.

## 4. Planning & Task Decomposition

- Decompose the CI/CD process into:
  - **Atomic tasks**: single responsibility, small steps
  - **Sequential tasks**: jobs executed in order via `needs`
  - **Actionable steps**: explicit commands with defined outputs
- Only implement steps after confirming **100% correctness in simulation or dry-run**.

## 5. Implementation Guidelines

- Jobs must be **concise, deterministic, and reproducible**.
- Use official actions whenever possible:
  - `actions/checkout` for source code
  - `actions/setup-node` for Node environment
  - `firebase/actions` or similar for deployment
- Integrate caching to optimize build times (`actions/cache`).
- Environment variables and secrets should be **managed via GitHub repository secrets**, never hardcoded.

## 6. Build & Quality Assurance

- Ensure **TypeScript compiles cleanly** in CI (`tsc --noEmit`).
- Verify **Angular AOT builds** successfully.
- Run **unit and integration tests** automatically.
- Linting and formatting must pass before merging (`eslint`, `prettier`).

## 7. Knowledge Accumulation & Pipeline Memory

- Log pipeline outcomes and any failed steps.
- Maintain structured documentation for workflows:
  - Job purpose
  - Dependencies
  - Environment setup
- Accumulate context for **future automation, error prevention, and process optimization**.
