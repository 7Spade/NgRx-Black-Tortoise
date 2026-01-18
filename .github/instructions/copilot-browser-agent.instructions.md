---
description: "Comprehensive instructions for Copilot Browser Agent to analyze, refactor, and ensure DDD-compliant, fully reactive Angular 20 project code using Material Design 3, Angular Material/CDK, NgRx Signals, and AngularFire."
applyTo: '**'
---

# Copilot Project Guidelines and Instructions

This is an Angular 20 project using Material Design 3 + Angular Material/CDK for UI components,
NgRx Signals for reactive state management, and AngularFire for Firebase backend integration.

## Project-wide Rules

### 1. Domain / Repository layer

* Must be framework-agnostic (no RxJS Observable, no Angular-specific code)
* Repository methods return plain domain objects or Promises
* Domain logic only, no UI or Angular code

### 2. Application layer

* Wrap repository results into NgRx Signals
* Handle async data from repositories
* Can combine multiple repository calls into reactive signals

### 3. UI / Presentation layer

* Uses Angular 20 template syntax
* Uses Signals for reactive rendering
* Uses Material 3 + Angular Material components

Whenever generating, refactoring, or reviewing any Repository, Service, or Application logic, follow these rules.

## Current Task

* Analyze the existing code across the entire project, not just single files.
* Identify any Repository, Application, or UI code that violates the project-wide rules above.
* Refactor Repository layers to remove Observables, Angular-specific code, or any framework coupling.
* Ensure Repository methods return plain domain objects or Promises.
* Refactor Application layer to wrap repository results into NgRx Signals.
* Ensure UI layers consume Signals properly using Angular 20 templates and Material 3 components.
* Keep domain logic clean, framework-agnostic, and fully DDD-compliant.
* Prioritize keeping the original code style, changing only non-compliant code.
* Highlight suggested changes and provide corrected code snippets or patterns.
* Apply these corrections throughout the entire project consistently.

## Modern Angular Front-End Development Guidelines

### 1. Overall Architecture & Technology Stack

* Project uses Material Design 3 + Angular Material/CDK for consistent UI and components.
* Angular 20 control flow, NgRx Signals, and AngularFire handle front-end data flow and state management.
* Must adopt a zone-less, fully reactive architecture.

### 2. Core Design Principles

* Strictly follow Single Responsibility Principle (SRP).
* Enforce clear separation of concerns across all layers.
* Ensure folder and file semantic consistency; immediately fix any ambiguous or misleading references.
* Refactor code immediately if it improves clarity or aligns with guidelines.

### 3. Requirement Analysis & Validation

* Translate user requirements into clearly defined, analyzable problems.
* Use sequential thinking to analyze requirements step by step.
* Each sub-task must be fully understood and logically validated before proceeding.
* Any technical uncertainty must be clarified via Context7, referencing the latest official documentation.

### 4. Planning & Task Decomposition (MCP)

* Decompose requirements into atomic, sequential, actionable tasks.
* Define a clear Plan (MCP) before implementation.
* Only implement or modify after the simulation reaches 100% confidence.

### 5. Implementation Guidelines

* Use subagent-level reasoning and code generation to maximize speed and accuracy.
* Return only the most concise and efficient code that fulfills the request.
* Ensure UI implementations comply with Material Design 3 + Angular Material + CDK standards.
* Integrate Firebase using @angular/fire with @ngrx/signals for seamless state management.

### 6. Build & Quality Assurance

* Ensure TypeScript compiles cleanly.
* Ensure Angular AOT build succeeds without errors.
* Code correctness and architectural integrity are mandatory before considering a feature complete.

### 7. Knowledge Accumulation & Copilot Memory

* After each feature implementation, write corresponding development experience into Copilot Memory.
* Split entries into multiple, coherent chunks.
* Goal: accumulate inferable context to reduce error rates, avoid semantic confusion, and improve future inference accuracy.

## Final Instruction for Copilot Browser Agent

* Review all existing Repositories, Application layer classes, and UI code in the project.
* Refactor them according to the above rules and guidelines.
* Suggest corrected code snippets, highlight all changes, and ensure full compliance with DDD, Signals, AngularFire, and Material 3 standards.
