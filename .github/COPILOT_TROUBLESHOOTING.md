# Copilot Troubleshooting Guide

> **Common issues and solutions when using GitHub Copilot with this project**

---

## 🔍 Issue Categories

- [Copilot Not Responding](#copilot-not-responding)
- [Wrong Suggestions](#wrong-suggestions)
- [Skills Not Loading](#skills-not-loading)
- [Performance Issues](#performance-issues)
- [Configuration Problems](#configuration-problems)
- [Architecture Violations](#architecture-violations)

---

## Copilot Not Responding

### Symptom
Copilot doesn't provide suggestions or chat responses

### Solutions

1. **Check Extension Status**
   - Open VS Code Command Palette (Cmd/Ctrl+Shift+P)
   - Type "GitHub Copilot: Check Status"
   - Ensure you're logged in and have an active subscription

2. **Verify Network Connection**
   - Copilot requires internet connectivity
   - Check firewall/proxy settings
   - Test with: `ping github.com`

3. **Restart Extension**
   ```
   1. Cmd/Ctrl+Shift+P
   2. "Developer: Reload Window"
   ```

4. **Clear Cache**
   ```bash
   # Close VS Code first
   rm -rf ~/.vscode/extensions/github.copilot-*
   # Restart VS Code and reinstall Copilot
   ```

5. **Check Settings**
   - Open `.vscode/settings.json`
   - Verify `"github.copilot.enable": { "*": true }`

---

## Wrong Suggestions

### Symptom
Copilot suggests patterns that violate project rules (e.g., traditional NgRx, *ngIf)

### Solutions

1. **Context Not Loaded**
   - Open `.github/copilot-instructions.md` in editor
   - Copilot needs project context to be active
   - Keep important instruction files open in tabs

2. **Be More Specific**
   ```
   ❌ Bad: "Create a component"
   ✅ Good: "Create a standalone Angular 20 component using @if/@for control flow and inject() for dependencies"
   ```

3. **Reference Instructions**
   ```
   @copilot Follow the NgRx Signals instructions in .github/instructions/ngrx-signals.instructions.md
   ```

4. **Use Skills Explicitly**
   ```
   Load the @ngrx-signals skill and create a signal store for workspace management
   ```

5. **Correct and Teach**
   - When Copilot suggests wrong patterns, correct it
   - Add feedback: "No, use @if instead of *ngIf"
   - Copilot learns from your corrections in the session

### Common Wrong Patterns

| Wrong | Correct |
|-------|---------|
| `*ngIf="condition"` | `@if (condition()) { }` |
| `*ngFor="let item of items"` | `@for (item of items(); track item.id) { }` |
| `import { createAction } from '@ngrx/store'` | `import { signalStore } from '@ngrx/signals'` |
| `.subscribe(data => ...)` | `rxMethod(...tapResponse(...))` |
| `@Component({ })` without standalone | `@Component({ standalone: true })` |

---

## Skills Not Loading

### Symptom
Agent skills not automatically discovered or suggestions don't follow skill patterns

### Solutions

1. **Verify Skill Structure**
   ```
   .github/skills/my-skill/
   ├── SKILL.md          ✅ Must be named exactly SKILL.md
   ├── references/       ✅ Optional supporting docs
   └── templates/        ✅ Optional templates
   ```

2. **Check SKILL.md Frontmatter**
   ```yaml
   ---
   name: my-skill
   description: >
     Clear description with WHEN to use this skill.
     Include keywords that match user prompts.
   license: MIT
   ---
   ```

3. **Verify Skill Naming**
   - Skill directory name should match `name` in frontmatter
   - Use lowercase with hyphens: `angular-material` not `AngularMaterial`

4. **Check Description Quality**
   ```yaml
   # ❌ Bad: Too vague
   description: Angular helpers
   
   # ✅ Good: Specific triggers
   description: >
     Angular Material component patterns for Angular 20+.
     Use when working with Material Design components, 
     theming, or UI development.
   ```

5. **Force Load Skill**
   ```
   @copilot Load the angular-material skill and help me create a Material dialog
   ```

6. **Check File Permissions**
   ```bash
   # Skills must be readable
   chmod -R 644 .github/skills/*/SKILL.md
   ```

---

## Performance Issues

### Symptom
Copilot is slow, suggestions take too long, or chat is laggy

### Solutions

1. **Reduce Context Size**
   - Close unnecessary files
   - Don't open entire large directories
   - Use `.copilot.yml` to exclude large files:
     ```yaml
     indexing:
       exclude:
         - "node_modules/**"
         - "dist/**"
         - "*.min.js"
     ```

2. **Optimize Workspace**
   - Close other CPU-intensive applications
   - Ensure at least 4GB free RAM
   - Check VS Code CPU usage in Activity Monitor/Task Manager

3. **Limit Concurrent Files**
   ```json
   // .vscode/settings.json
   {
     "github.copilot.advanced": {
       "inlineSuggest.count": 1  // Reduce from 3
     }
   }
   ```

4. **Clear Workspace Cache**
   ```bash
   # Close VS Code
   rm -rf .vscode/.cache
   rm -rf .angular
   ```

5. **Use Faster Model**
   ```json
   {
     "github.copilot.advanced": {
       "debug.overrideEngine": "gpt-3.5-turbo"  // Faster but less accurate
     }
   }
   ```

6. **Reduce File Watchers**
   ```json
   // .vscode/settings.json
   {
     "files.watcherExclude": {
       "**/node_modules/**": true,
       "**/.angular/**": true,
       "**/dist/**": true
     }
   }
   ```

---

## Configuration Problems

### Symptom
Copilot ignores project settings or doesn't apply custom configurations

### Solutions

1. **Check Configuration Priority**
   ```
   1. .github/copilot.yml          (highest priority)
   2. .vscode/settings.json
   3. User settings
   4. Default settings
   ```

2. **Validate YAML Syntax**
   ```bash
   # Install yamllint
   npm install -g yaml-lint
   
   # Validate config
   yamllint .github/copilot.yml
   ```

3. **Check JSON Syntax**
   ```bash
   # Validate settings.json
   node -e "JSON.parse(require('fs').readFileSync('.vscode/settings.json'))"
   ```

4. **Reload Configuration**
   ```
   1. Cmd/Ctrl+Shift+P
   2. "Developer: Reload Window"
   ```

5. **Verify File Paths**
   - Use absolute paths from project root
   - Check file actually exists: `ls -la .github/copilot.yml`

6. **Check Permissions**
   ```bash
   # Ensure readable
   chmod 644 .github/copilot.yml
   chmod 644 .vscode/settings.json
   ```

---

## Architecture Violations

### Symptom
Copilot suggests code that violates DDD architecture or layer boundaries

### Solutions

1. **Load Architecture Context**
   - Open `.github/copilot-instructions.md`
   - Open `AGENTS.md`
   - Open `.github/project-layer-mapping.yml`
   - Keep these files in active tabs

2. **Be Explicit About Layer**
   ```
   ❌ Bad: "Create a user service"
   
   ✅ Good: "Create a user service in the infrastructure layer 
            that implements the IUserRepository interface from 
            the domain layer"
   ```

3. **Reference Layer Mapping**
   ```
   @copilot Check .github/project-layer-mapping.yml and create 
           a workspace entity in the correct domain layer
   ```

4. **Use DDD Agents**
   ```
   Use the GPT-5.2-Codex agent to create a DDD-compliant 
   workspace feature
   ```

5. **Enforce with Prompts**
   ```
   Use the breakdown-feature-implementation prompt to plan 
   this feature following DDD architecture
   ```

6. **Common Violations to Watch**

   | Violation | Solution |
   |-----------|----------|
   | Domain imports Angular | Move to application layer |
   | UI directly injects Firebase | Use application store |
   | Business logic in component | Move to domain/application |
   | Store talks to another store | Use EventBus pattern |
   | Service has business rules | Move to domain layer |

---

## Debugging Checklist

When Copilot isn't working as expected:

- [ ] Copilot extension is active and logged in
- [ ] Network connection is stable
- [ ] Project `.github/copilot-instructions.md` is open in editor
- [ ] `.vscode/settings.json` has Copilot enabled
- [ ] No syntax errors in config files (`.yml`, `.json`)
- [ ] Relevant instruction files are discoverable
- [ ] Skills have proper SKILL.md with frontmatter
- [ ] Using specific, context-aware prompts
- [ ] Not violating forbidden patterns
- [ ] Following layer architecture rules

---

## Getting Better Results

### Best Practices

1. **Start with Context**
   ```
   I need to create a workspace switcher component.
   Context:
   - This is an Angular 20 app using @ngrx/signals
   - Follow DDD architecture
   - Component should be in presentation layer
   - State in WorkspaceStore (application layer)
   - Data from WorkspaceService (infrastructure layer)
   ```

2. **Reference Examples**
   ```
   Create a component similar to the identity-switcher,
   but for workspace selection
   ```

3. **Iterate and Refine**
   ```
   That's close, but use @if instead of *ngIf
   Also inject the store with inject() not constructor injection
   ```

4. **Use Commands**
   ```
   /new Create workspace entity following DDD
   /fix Review this for Angular 20 patterns
   /tests Generate store tests
   ```

5. **Leverage Skills**
   - Copilot automatically loads skills based on context
   - Mention skill names explicitly if needed
   - Keep skill descriptions clear and trigger-rich

---

## Advanced Troubleshooting

### Enable Debug Logging

```json
// .vscode/settings.json
{
  "github.copilot.advanced": {
    "debug.enable": true,
    "debug.overrideProxyUrl": ""
  }
}
```

View logs:
```
1. Cmd/Ctrl+Shift+P
2. "Developer: Open Extension Logs Folder"
3. Find "github.copilot" folder
```

### Test Configuration

```bash
# Verify copilot.yml is valid
cat .github/copilot.yml | python -c "import yaml,sys; yaml.safe_load(sys.stdin)"

# Verify settings.json is valid
cat .vscode/settings.json | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin'))"

# Check skill frontmatter
head -20 .github/skills/angular-20/SKILL.md
```

### Report Issues

If problems persist:

1. **Collect Information**
   - Copilot version
   - VS Code version
   - Operating system
   - Error messages from logs

2. **Create Minimal Reproduction**
   - Isolate the issue
   - Remove unrelated code
   - Document steps to reproduce

3. **Check Known Issues**
   - [Copilot GitHub Issues](https://github.com/github/copilot-docs/issues)
   - [VS Code Issues](https://github.com/microsoft/vscode/issues)

---

## Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| No suggestions | Restart VS Code |
| Wrong patterns | Open instruction files |
| Slow performance | Close unused files |
| Skills not loading | Check SKILL.md frontmatter |
| Config ignored | Reload window |
| Architecture violations | Use DDD agents |

---

## Support Resources

- **Project Documentation**: [COPILOT_INDEX.md](./COPILOT_INDEX.md)
- **Quick Reference**: [COPILOT_QUICK_REFERENCE.md](./COPILOT_QUICK_REFERENCE.md)
- **Architecture Rules**: [copilot-instructions.md](./copilot-instructions.md)
- **Copilot Docs**: https://docs.github.com/copilot

---

**Pro Tip**: When in doubt, be more specific and provide more context. Copilot works best with clear, detailed instructions!
