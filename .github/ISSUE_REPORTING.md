# Reporting Good Issues

## Purpose

Good issues help maintainers understand the problem quickly, reproduce it reliably, and decide what to fix first.

For a library issue, the goal is not just to say that something is broken. The goal is to provide enough context for someone else to reproduce the problem without guesswork.

## Before Opening An Issue

Please check these first:

- you are using a supported or recent version of the library
- the issue is not already reported
- the behavior is not already documented
- you tested with the smallest possible setup
- you removed unrelated app code from your reproduction

If the problem turns out to be usage-related, that is still useful feedback. Just describe clearly what you expected from the API or documentation.

## What A Good Library Issue Should Include

### 1. A clear title

Use a title that says what breaks, where, and in which situation.

Good examples:

- `react-walkit crashes when StepProvider receives an empty steps array`
- `react-formbridge does not reset field state after calling reset()`
- `TypeScript types fail for createBridge() in strict mode`

Avoid titles like:

- `Bug`
- `Help`
- `It does not work`

### 2. The affected package and version

Always include:

- package name
- library version
- related package versions if relevant

Example:

```txt
Package: @runilib/react-walkit
Version: 0.4.2
Related: react 19.1.0, typescript 5.8.3
```

### 3. Environment details

Include the environment only if it matters, but for bugs it often does.

Useful details:

- OS
- Node.js version
- package manager
- browser and version
- framework version
- bundler or runtime

Example:

```txt
OS: macOS 15.4
Node: 22.14.0
Package manager: yarn 4.9.1
Browser: Chrome 134
Framework: Next.js 15.2.1
```

### 4. A minimal reproduction

This is often the most important part.

A good reproduction is:

- as small as possible
- isolated from unrelated business code
- easy to run
- focused on one problem only

Best options:

- a minimal GitHub repo
- a StackBlitz, CodeSandbox, or similar sandbox
- a short self-contained code sample if the issue is simple

If no reproduction is available yet, say so explicitly and still provide exact steps.

### 5. Exact steps to reproduce

Write steps someone else can follow exactly.

Good example:

1. Install `@runilib/react-walkit@0.4.2`.
2. Render `StepProvider` with an empty `steps` array.
3. Open the page.
4. Click `Start walkthrough`.
5. Observe the runtime crash.

### 6. Expected behavior

Describe what you believe should happen.

Example:

```txt
Expected behavior:
The provider should ignore the action and return no active step instead of throwing.
```

### 7. Actual behavior

Describe what actually happens.

Example:

```txt
Actual behavior:
The app throws a runtime error and the page becomes unusable.
```

### 8. Error output, logs, or screenshots

If there is an error message, include it exactly.

Useful additions:

- stack trace
- console output
- network error details
- screenshots
- short screen recording for UI issues

Do not paraphrase an error if you can paste the real one.

### 9. Impact and severity

Help maintainers understand the importance of the issue.

Useful context:

- blocks production use
- affects only development
- affects only TypeScript users
- regression from a previous version
- affects all consumers or only a niche setup

### 10. Workarounds already tried

This prevents duplicate suggestions and shows what has already been ruled out.

Example:

```txt
Workarounds tried:
- passing a default step
- delaying initialization with useEffect
- downgrading from 0.4.2 to 0.4.1
```

## What Makes An Issue Hard To Triage

Issues are much harder to act on when they:

- do not include versions
- do not include reproduction steps
- mix multiple bugs in one report
- describe symptoms without expected behavior
- paste large app-specific code without isolating the bug
- say only "latest version" instead of an exact version number

## Recommended Issue Structure

You can use this structure for most library issues:

```md
## Summary
Short description of the problem.

## Package
- Package: @scope/package-name
- Version: x.y.z

## Environment
- OS:
- Node:
- Package manager:
- Browser:
- Framework:

## Steps To Reproduce
1.
2.
3.

## Expected Behavior

## Actual Behavior

## Reproduction
Link to repo or sandbox.

## Logs / Screenshots
Paste the exact error message, stack trace, or add visuals.

## Impact
Describe whether this is blocking, a regression, or limited to a specific setup.

## Workarounds Tried
- 
```

## Copy-Paste Template

```md
## Summary

## Package
- Package:
- Version:

## Environment
- OS:
- Node:
- Package manager:
- Browser:
- Framework:

## Steps To Reproduce
1.
2.
3.

## Expected Behavior

## Actual Behavior

## Reproduction

## Logs / Screenshots

## Impact

## Workarounds Tried
-
```

## Maintainer Note

The fastest issues to resolve usually include:

- an exact version
- a minimal reproduction
- precise steps
- expected versus actual behavior
- the real error output
