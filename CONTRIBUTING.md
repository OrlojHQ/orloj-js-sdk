# Contributing to `orloj-js-sdk`

Thanks for helping improve the official TypeScript SDK. This document describes how to set up a dev environment, run checks, and submit changes.

## Prerequisites

- **Node.js 18+** (CI also runs 20 and 22)
- **npm** (or a compatible client)

## Getting started

1. **Fork** [OrlojHQ/orloj-js-sdk](https://github.com/OrlojHQ/orloj-js-sdk) on GitHub (use the Fork button on that repo).
2. **Clone your fork** locally (not the upstream URL):

   ```bash
   git clone https://github.com/<your-github-username>/orloj-js-sdk.git
   cd orloj-js-sdk
   npm install
   ```

3. Add the upstream remote so you can sync with the main repository:

   ```bash
   git remote add upstream https://github.com/OrlojHQ/orloj-js-sdk.git
   ```

Create a branch for your work, push to **your fork**, then open a pull request from your fork against **OrlojHQ/orloj-js-sdk**.

## Before you open a PR

Run the same checks CI runs:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Fix any failures. For iterative work:

```bash
npm run test:watch
```

## Project layout

| Path        | Role                                              |
| ----------- | ------------------------------------------------- |
| `src/`      | SDK source (client, transport, types, resources)  |
| `tests/`    | Vitest + MSW                                      |
| `examples/` | Runnable samples (`tsx`; see `npm run example:*`) |
| `dist/`     | Build output (gitignored)                         |

## Code expectations

- Match existing style: strict TypeScript, `.js` extensions in ESM imports, minimal surface-area changes per PR.
- Prefer tests for behavior changes (especially HTTP paths, serialization, and pagination).
- Align HTTP behavior with [docs.orloj.dev](https://docs.orloj.dev/reference/api) when in doubt.
- Do not commit secrets or large generated artifacts.

## Pull requests

- Open PRs **from your fork** to the upstream default branch (the GitHub UI will offer this after you push).
- Use a clear title and description (the PR template will prompt you).
- Link related issues when applicable.
- Keep unrelated refactors out of the same PR as bugfixes or features.

## License

By contributing, you agree that your contributions are licensed under the same terms as the project (**Apache-2.0**).
