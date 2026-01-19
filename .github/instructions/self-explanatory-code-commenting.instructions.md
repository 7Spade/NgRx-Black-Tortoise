---
description: 'Configuration for AI behavior when writing code comments - prefer self-explanatory code over excessive commenting'
applyTo: '**'
---

# Code Commenting Rules
Configuration for AI behavior when writing code comments

## CRITICAL: Core principle
- **Write code that speaks for itself**
- MUST comment only when necessary to explain WHY, not WHAT
- Most code should NOT need comments
- Self-explanatory code > comments
- > NOTE: The best comment is the one you don't need to write

## When writing comments is FORBIDDEN
- MUST NOT write obvious comments:
  ```javascript
  // BAD: States the obvious
  let counter = 0;  // Initialize counter to zero
  counter++;  // Increment counter by one
  ```
- MUST NOT write redundant comments:
  ```javascript
  // BAD: Comment repeats the code
  function getUserName() {
    return user.name;  // Return the user's name
  }
  ```
- MUST NOT write outdated comments:
  ```javascript
  // BAD: Comment doesn't match the code
  // Calculate tax at 5% rate
  const tax = price * 0.08;  // Actually 8%
  ```
- MUST NOT comment out dead code (delete instead)
- MUST NOT maintain changelog in comments (use git history)
- MUST NOT use decorative divider comments

## When comments ARE required
- Complex business logic requiring WHY explanation:
  ```javascript
  // GOOD: Explains WHY this specific calculation
  // Apply progressive tax brackets: 10% up to 10k, 20% above
  const tax = calculateProgressiveTax(income, [0.10, 0.20], [10000]);
  ```
- Non-obvious algorithm choices:
  ```javascript
  // GOOD: Explains the algorithm choice
  // Using Floyd-Warshall for all-pairs shortest paths
  // because we need distances between all nodes
  for (let k = 0; k < vertices; k++) {
    // ... implementation
  }
  ```
- Regex patterns:
  ```javascript
  // GOOD: Explains what the regex matches
  // Match email format: username@domain.extension
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  ```
- API constraints or external gotchas:
  ```javascript
  // GOOD: Explains external constraint
  // GitHub API rate limit: 5000 requests/hour for authenticated users
  await rateLimiter.wait();
  const response = await fetch(githubApiUrl);
  ```

## CRITICAL: Decision framework before writing ANY comment
- Ask these questions:
  1. Is the code self-explanatory? → NO comment needed
  2. Would a better variable/function name eliminate the need? → Refactor instead
  3. Does this explain WHY, not WHAT? → Good comment
  4. Will this help future maintainers? → Good comment
- If answer to questions 1-2 is yes, DO NOT write comment
- Only proceed if questions 3-4 are yes

## When documenting public APIs
- MUST use JSDoc for public APIs:
  ```javascript
  /**
   * Calculate compound interest using the standard formula.
   * 
   * @param {number} principal - Initial amount invested
   * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
   * @param {number} time - Time period in years
   * @param {number} compoundFrequency - How many times per year interest compounds (default: 1)
   * @returns {number} Final amount after compound interest
   */
  function calculateCompoundInterest(principal, rate, time, compoundFrequency = 1) {
    // ... implementation
  }
  ```
- Include `@param`, `@returns`, `@throws` for all public methods
- Add usage examples when behavior is not obvious

## When using annotation comments
- Use standard annotations for tracking:
  - `TODO:` - Work to be done later
  - `FIXME:` - Known bug needing fix
  - `HACK:` - Temporary workaround
  - `NOTE:` - Important information
  - `WARNING:` - Danger or side effects
  - `PERF:` - Performance consideration
  - `SECURITY:` - Security concern
  - `BUG:` - Edge case failure
  - `REFACTOR:` - Code needing improvement
  - `DEPRECATED:` - Feature being removed
- EXAMPLE:
  ```javascript
  // TODO: Replace with proper user authentication after security review
  // FIXME: Memory leak in production - investigate connection pooling
  // HACK: Workaround for bug in library v2.1.0 - remove after upgrade
  ```

## When explaining configuration and constants
- Explain the SOURCE or REASONING:
  ```javascript
  // GOOD: Explains the source or reasoning
  const MAX_RETRIES = 3;  // Based on network reliability studies
  const API_TIMEOUT = 5000;  // AWS Lambda timeout is 15s, leaving buffer
  ```

## Quality checklist for all comments
- [ ] Explains WHY, not WHAT
- [ ] Are grammatically correct and clear
- [ ] Will remain accurate as code evolves
- [ ] Add genuine value to code understanding
- [ ] Are placed appropriately (above the code they describe)
- [ ] Use proper spelling and professional language

## General
- Prefer self-explanatory code over comments
- Write comments only when necessary to explain WHY
- Refactor code instead of adding WHAT comments
- Delete dead code instead of commenting it out
- Use git history for changelog, not comments
- Document public APIs with JSDoc
- Use standard annotation keywords consistently
- Ensure comments remain accurate as code evolves
