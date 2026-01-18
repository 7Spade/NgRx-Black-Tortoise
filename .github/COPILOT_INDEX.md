# GitHub Copilot Knowledge Base Index

> **Quick Navigation for AI Assistants and Developers**

This document provides a structured index of all Copilot-related resources in this repository, organized by purpose and priority.

---

## 🎯 Start Here

| Resource | Purpose | Priority |
|----------|---------|----------|
| [Main Instructions](.github/copilot-instructions.md) | Core architecture rules and constraints | ⭐⭐⭐ |
| [AGENTS.md](AGENTS.md) | AI agent context and quick reference | ⭐⭐⭐ |
| [README.md](README.md) | Project overview and architecture | ⭐⭐⭐ |
| [Forbidden Rules](.github/forbidden-copilot-instructions.md) | Files that must not be modified | ⭐⭐⭐ |

---

## 📚 Instruction Files

### Architecture & Design Patterns

| File | Focus Area | Apply To |
|------|------------|----------|
| [Project Structure](./instructions/project-structure.instructions.md) | File organization, naming, dependencies | `**` |
| [DDD Architecture](./instructions/ng-ddd-architecture.instructions.md) | Domain-driven design patterns | `src/app/domain/**/*.ts` |
| [NgRx Signals](./instructions/ngrx-signals.instructions.md) | State management with signals | `**/*store.ts` |

### Angular-Specific

| File | Focus Area | Apply To |
|------|------------|----------|
| [Angular Core](./instructions/angular.instructions.md) | General Angular best practices | `**/*.ts, **/*.html` |
| [Angular 20 Control Flow](./instructions/ng-angular-20-control-flow.instructions.md) | @if/@for/@switch syntax | `**/*.html` |
| [Angular Material](./instructions/ng-angular-material.instructions.md) | Material Design components | `**/*.ts, **/*.html` |
| [Angular CDK](./instructions/ng-angular-cdk.instructions.md) | Component Dev Kit | `**/*.ts` |
| [Angular Router](./instructions/ng-angular-router.instructions.md) | Routing and navigation | `**/*.routes.ts` |
| [Angular Forms](./instructions/ng-angular-forms.instructions.md) | Reactive forms | `**/*form*.ts` |

### Firebase Integration

| File | Focus Area | Apply To |
|------|------------|----------|
| [AngularFire](./instructions/ng-angularfire.instructions.md) | Firebase integration | `**/*.ts` |
| [Firebase Data Connect](./instructions/ng-firebase-data-connect.instructions.md) | GraphQL with Firebase | `dataconnect/**/*.gql` |

### Code Quality & Standards

| File | Focus Area | Apply To |
|------|------------|----------|
| [TypeScript Standards](./instructions/typescript-5-es2022.instructions.md) | TypeScript best practices | `**/*.ts` |
| [RxJS Patterns](./instructions/ng-rxjs-patterns.instructions.md) | Reactive programming | `**/*.ts` |
| [Self-Explanatory Code](./instructions/self-explanatory-code-commenting.instructions.md) | Commenting guidelines | `**` |
| [Security & OWASP](./instructions/security-and-owasp.instructions.md) | Security best practices | `**` |
| [Performance Optimization](./instructions/performance-optimization.instructions.md) | Performance guidelines | `**` |

### Development Workflow

| File | Focus Area | Apply To |
|------|------------|----------|
| [Spec-Driven Workflow](./instructions/spec-driven-workflow-v1.instructions.md) | Development process | `**` |
| [Task Implementation](./instructions/task-implementation.instructions.md) | Task execution guidelines | `.copilot-tracking/changes/*.md` |
| [Update Documentation](./instructions/update-docs-on-code-change.instructions.md) | Documentation maintenance | `**/*.md` |

### Meta & AI

| File | Focus Area | Apply To |
|------|------------|----------|
| [Agent Skills](./instructions/agent-skills.instructions.md) | Creating agent skills | `**/.github/skills/**/SKILL.md` |
| [Custom Instructions](./instructions/instructions.instructions.md) | Writing instruction files | `**/*.instructions.md` |
| [Prompt Engineering](./instructions/prompt.instructions.md) | Prompt file creation | `**/*.prompt.md` |
| [AI Prompt Safety](./instructions/ai-prompt-engineering-safety-best-practices.instructions.md) | Safe AI usage | `**` |

### Tools & CI/CD

| File | Focus Area | Apply To |
|------|------------|----------|
| [GitHub Actions](./instructions/github-actions-ci-cd-best-practices.instructions.md) | CI/CD workflows | `.github/workflows/*.yml` |
| [Codacy](./instructions/codacy.instructions.md) | Code quality tools | `**` |

---

## 🎨 Agent Skills

Skills are automatically loaded by Copilot based on context. They are located in `.github/skills/`.

### Framework Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| [Angular 20](.github/skills/angular-20/) | Angular 20 features and patterns | Angular development |
| [Angular Control Flow](.github/skills/angular-20-control-flow/) | @if/@for/@switch syntax | Template editing |
| [Angular Material](.github/skills/angular-material/) | Material components | Material UI work |
| [Angular CDK](.github/skills/angular-cdk/) | Component Dev Kit | Custom components |
| [Angular Router](.github/skills/angular-router/) | Routing patterns | Navigation work |
| [Angular Forms](.github/skills/angular-forms/) | Form handling | Form development |
| [Angular Google Maps](.github/skills/angular-google-maps/) | Maps integration | Map features |

### State Management Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| [@ngrx/signals](.github/skills/@ngrx-signals/) | Signal-based state | Store development |
| [RxJS Patterns](.github/skills/rxjs-patterns/) | Reactive patterns | Observable usage |

### Firebase Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| [AngularFire](.github/skills/angularfire/) | Firebase integration | Firebase work |
| [Firebase Data Connect](.github/skills/firebase-data-connect/) | GraphQL + Firebase | Data Connect |

### Design & Architecture Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| [DDD Architecture](.github/skills/ddd-architecture/) | Domain-driven design | Architecture work |
| [Material Design 3](.github/skills/material-design-3/) | MD3 theming | Design system |

### Development Tools Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| [Web Design Reviewer](.github/skills/web-design-reviewer/) | UI review and fixes | Design issues |
| [Webapp Testing](.github/skills/webapp-testing/) | Playwright testing | E2E testing |
| [VS Code Extensions](.github/skills/vscode-ext-commands/) | Extension development | VS Code work |

---

## 💬 Prompt Templates

Reusable prompts for common tasks, located in `.github/prompts/`:

### Planning & Architecture

- **[Breakdown Epic (Arch)](./prompts/breakdown-epic-arch.prompt.md)** - Architecture planning
- **[Breakdown Epic (PM)](./prompts/breakdown-epic-pm.prompt.md)** - Product planning
- **[Create ADR](./prompts/create-architectural-decision-record.prompt.md)** - Architecture decisions
- **[Create Specification](./prompts/create-specification.prompt.md)** - Spec documents

### Documentation

- **[Create README](./prompts/create-readme.prompt.md)** - README generation
- **[Create AGENTS.md](./prompts/create-agentsmd.prompt.md)** - Agent context
- **[Documentation Writer](./prompts/documentation-writer.prompt.md)** - General docs
- **[Update Specification](./prompts/update-specification.prompt.md)** - Spec updates

### Implementation

- **[Implementation Plan](./prompts/create-implementation-plan.prompt.md)** - Create plans
- **[Update Implementation Plan](./prompts/update-implementation-plan.prompt.md)** - Update plans
- **[Breakdown Feature](./prompts/breakdown-feature-implementation.prompt.md)** - Feature breakdown
- **[Structured Autonomy](./prompts/structured-autonomy-generate.prompt.md)** - Autonomous tasks

### Testing & Quality

- **[Breakdown Test](./prompts/breakdown-test.prompt.md)** - Test planning
- **[Playwright Tests](./prompts/playwright-generate-test.prompt.md)** - E2E tests
- **[Review & Refactor](./prompts/review-and-refactor.prompt.md)** - Code review

### Workflows

- **[GitHub Action Workflow](./prompts/create-github-action-workflow-specification.prompt.md)** - CI/CD specs
- **[Project Workflow Analysis](./prompts/project-workflow-analysis-blueprint-generator.prompt.md)** - Workflow blueprints

---

## 🤖 Custom Agents

Specialized agents for specific tasks, located in `.github/agents/`:

| Agent | Purpose | Use When |
|-------|---------|----------|
| [GPT-5.2-Codex](.github/agents/GPT-5.2-Codex-v1_EN-specialized.agent.md) | Angular 20 + DDD + NgRx Signals | Main development |
| [GPT-5.1-Codex-Max-v6](.github/agents/GPT-5.1-Codex-Max-v6_EN-specialized.agent.md) | Unified DDD + Firebase | Alternative |
| [4.1-Beast](.github/agents/4.1-Beast.agent.md) | GPT-4.1 coding agent | Code generation |
| [Planner](.github/agents/planner.agent.md) | Strategic planning | Architecture decisions |
| [Arch](.github/agents/arch.agent.md) | Architecture design | System design |
| [Janitor](.github/agents/janitor.agent.md) | Code cleanup | Tech debt |
| [Context7](.github/agents/context7.agent.md) | Latest library docs | Research |

---

## 📋 Collections

Task-oriented collections in `.github/collections/`:

| Collection | Focus |
|------------|-------|
| [Security Best Practices](./collections/security-best-practices.md) | Security guidelines |
| [Project Planning](./collections/project-planning.md) | Planning workflows |
| [Technical Spike](./collections/technical-spike.md) | Research tasks |
| [Testing Automation](./collections/testing-automation.md) | Test workflows |
| [Software Engineering Team](./collections/software-engineering-team.md) | Team processes |
| [Edge AI Tasks](./collections/edge-ai-tasks.md) | AI-specific tasks |

---

## 🗺️ Layer Mapping

The [project-layer-mapping.yml](.github/project-layer-mapping.yml) defines the DDD layer structure:

```yaml
domain:       src/app/core/**/models
application:  src/app/core/**/stores
infrastructure: src/app/core/**/services
interface:    src/app/features/**
```

---

## 🚫 Forbidden Patterns

Critical rules from [forbidden-copilot-instructions.md](.github/forbidden-copilot-instructions.md):

- ❌ **Never modify**: `src/index.html`, `src/dataconnect-generated/**`
- ❌ **Never use**: Traditional NgRx (actions/reducers/effects)
- ❌ **Never use**: Zone.js dependencies
- ❌ **Never use**: Legacy control flow (`*ngIf`, `*ngFor`, `*ngSwitch`)

---

## 🎯 Quick Task Reference

### Need to...

| Task | Resources to Check |
|------|--------------------|
| Create a new feature | [DDD Architecture](./instructions/ng-ddd-architecture.instructions.md) + [NgRx Signals](./instructions/ngrx-signals.instructions.md) |
| Add state management | [NgRx Signals Skill](.github/skills/@ngrx-signals/) + [Instructions](./instructions/ngrx-signals.instructions.md) |
| Integrate Firebase | [AngularFire Skill](.github/skills/angularfire/) + [Instructions](./instructions/ng-angularfire.instructions.md) |
| Update UI components | [Angular Material Skill](.github/skills/angular-material/) + [Control Flow](./instructions/ng-angular-20-control-flow.instructions.md) |
| Write tests | [Webapp Testing Skill](.github/skills/webapp-testing/) + [Breakdown Test Prompt](./prompts/breakdown-test.prompt.md) |
| Plan architecture | [Arch Agent](.github/agents/arch.agent.md) + [Create ADR Prompt](./prompts/create-architectural-decision-record.prompt.md) |
| Clean up code | [Janitor Agent](.github/agents/janitor.agent.md) |
| Research libraries | [Context7 Agent](.github/agents/context7.agent.md) |

---

## 📖 Documentation Structure

```
docs/
├── DDD/                    # Domain-Driven Design docs
│   ├── GLOSSARY.md         # Terminology reference
│   ├── domain.md           # Domain layer
│   ├── application.md      # Application layer
│   ├── infrastructure.md   # Infrastructure layer
│   └── shared.md           # Shared utilities
├── ui/                     # UI specifications
│   ├── workspace-layout-spec/
│   └── switcher-ui-spec/
└── prd.md                  # Product requirements
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| [.github/copilot.yml](.github/copilot.yml) | Copilot behavior config |
| [.vscode/settings.json](.vscode/settings.json) | VS Code + Copilot settings |
| [.vscode/extensions.json](.vscode/extensions.json) | Recommended extensions |

---

## 📞 Getting Help

1. **For architecture questions**: Check [copilot-instructions.md](.github/copilot-instructions.md)
2. **For specific patterns**: Search [instructions/](.github/instructions/)
3. **For AI context**: Read [AGENTS.md](AGENTS.md)
4. **For tasks**: Browse [prompts/](.github/prompts/)
5. **For specialized work**: Use appropriate [agents/](.github/agents/)

---

**Last Updated**: 2026-01-17  
**Maintained By**: Project maintainers  
**Copilot Version**: Compatible with GitHub Copilot Chat and CLI
