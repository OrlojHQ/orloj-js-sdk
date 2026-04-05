# Orloj JS SDK

Official TypeScript SDK for the Orloj multi-agent orchestration platform.

## Install

```bash
npm install orloj
```

## Quickstart

```typescript
import { OrlojClient } from "orloj";

const client = new OrlojClient({
  baseUrl: "http://127.0.0.1:8080", // default
  apiToken: process.env.ORLOJ_API_TOKEN, // or ORLOJCTL_API_TOKEN
  namespace: "default",
});

const agents = await client.agents.list({ limit: 50 });
console.log(agents.items.map((a) => a.metadata.name));

const stream = client.tasks.watch({ name: "my-task" });
for await (const event of stream) {
  console.log(event.type, event.resource.status?.phase);
  if (event.resource.status?.phase === "Completed") {
    stream.abort();
    break;
  }
}
```

## Configuration

| Option       | Default                 | Env fallbacks                                        |
| ------------ | ----------------------- | ---------------------------------------------------- |
| `baseUrl`    | `http://127.0.0.1:8080` | `ORLOJCTL_SERVER`, then `ORLOJ_SERVER`               |
| `apiToken`   | —                       | `ORLOJCTL_API_TOKEN`, then `ORLOJ_API_TOKEN`         |
| `namespace`  | `"default"`             | —                                                    |
| `timeout`    | `30000` (ms)            | —                                                    |
| `maxRetries` | `0`                     | Retries GETs on 429 / 503 / transient network errors |
| `fetch`      | `globalThis.fetch`      | Custom implementation (e.g. tests or polyfills)      |

Environment variables are read only when `process` exists (Node, Bun, etc.). In browsers, pass `baseUrl` and `apiToken` explicitly.

## Features

- Typed resources: agents, agent systems, model endpoints, tools, secrets, memories, policies, roles, permissions, approvals, tasks, schedules, webhooks, workers, MCP servers, events, auth.
- **SSE watch** streams (`AsyncIterable`) for tasks, agents, schedules, webhooks, and global events.
- **Cursor pagination** with `list()` and `listAll()` (cursor field `continue` on list responses).
- **Spec field mapping**: TypeScript uses camelCase; request/response bodies remap `spec` fields to/from the server’s JSON (including the TaskWebhook `secretRef` ↔ `secret_ref` case).
- **Auth:** `client.auth.me()` (and `whoami()`) for identity; token CRUD on the auth resource matches `/v1/tokens` and `/v1/auth/*` per the API reference.
- **Tasks:** `getMessages()` and `getMetrics()` for the observability endpoints under `/v1/tasks/{name}/…`.

## API alignment

The client follows the [HTTP API reference](https://docs.orloj.dev/reference/api): resource CRUD under `/v1/{resource}`, watches (`/v1/tasks/watch`, etc.), **`GET /v1/auth/me`**, token management on **`/v1/tokens`**, **`GET /healthz`**, **`GET /v1/capabilities`**, **`GET /v1/namespaces`**, and **`GET /v1/tasks/{name}/messages`** / **`GET /v1/tasks/{name}/metrics`**. List responses use a top-level **`continue`** cursor (with `metadata.continue` still supported for compatibility).

## Examples

From the repo root (after `npm install`):

```bash
npm run example:quickstart
npm run example:watch-tasks
npm run example:multi-agent
npm run example:server
```

Examples use `new OrlojClient({})`, so `ORLOJ_API_TOKEN` and optional `ORLOJ_SERVER` / `ORLOJCTL_*` variables are read from the environment (see table above). Scripts that create resources expect a reachable Orloj API.

## Scripts

| Command              | Description                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run build`      | ESM + CJS + `.d.ts` into `dist/`                                                                      |
| `npm test`           | Vitest                                                                                                |
| `npm run test:watch` | Vitest watch mode                                                                                     |
| `npm run typecheck`  | `tsc --noEmit`                                                                                        |
| `npm run lint`       | ESLint (`src/`, `tests/`, `examples/`)                                                                |
| `npm run example:*`  | `example:quickstart`, `example:watch-tasks`, `example:multi-agent`, `example:server` (requires `tsx`) |

## License

Apache-2.0
