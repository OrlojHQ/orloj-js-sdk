/**
 * Watch an existing task by name (SSE).
 *
 *   ORLOJ_API_TOKEN=... npx tsx examples/watch-tasks.ts <task-name>
 */
import { OrlojClient } from "../src/index.js";

const arg = process.argv[2];
if (arg === undefined) {
  console.error("Usage: npx tsx examples/watch-tasks.ts <task-name>");
  process.exit(1);
}
const taskName = arg;

async function main() {
  const client = new OrlojClient({});
  const stream = client.tasks.watch({ name: taskName });

  for await (const event of stream) {
    const phase = event.resource.status?.phase;
    console.log(`[${event.type}] ${taskName} phase=${phase}`);
    if (phase === "Completed" || phase === "Failed") {
      stream.abort();
      break;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
