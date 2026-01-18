## Playwright / MCP execution rules

- This project is an Angular SPA.
- Do NOT assume full page reload after actions like login or submit.
- After clicking login or triggering navigation:
  - DO NOT immediately evaluate `window.location` or `location.href`
  - ALWAYS wait for a stable UI selector that represents successful navigation
    (e.g. dashboard layout, nav bar, main content)

### Playwright MCP rules

- Prefer `playwright_wait_for_selector` over `playwright_evaluate` for flow control
- `playwright_evaluate` must be short, synchronous, and guaranteed to resolve
- Never rely on navigation events for SPA routing
- If checking URL, wait for UI stability first

### CI / MCP constraints

- Do NOT run long-lived processes (e.g. ng serve) inside MCP tool calls
- Angular analytics must be disabled (`NG_CLI_ANALYTICS=false`)
