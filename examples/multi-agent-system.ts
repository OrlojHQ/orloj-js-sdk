/**
 * Create one agent per customer label (programmatic resource generation).
 *
 *   ORLOJ_API_TOKEN=... npx tsx examples/multi-agent-system.ts
 */
import { OrlojClient } from "../src/index.js";

const customers = [
  { id: "acme", model: "gpt-4o", maxSteps: 20 },
  { id: "globex", model: "claude-3-5-sonnet", maxSteps: 10 },
];

async function main() {
  const client = new OrlojClient({});

  for (const customer of customers) {
    const agent = await client.agents.create({
      apiVersion: "orloj.dev/v1",
      kind: "Agent",
      metadata: {
        name: `agent-${customer.id}`,
        labels: { customer: customer.id },
      },
      spec: {
        modelRef: customer.model,
        prompt: `You assist ${customer.id} customers.`,
        limits: { maxSteps: customer.maxSteps },
      },
    });
    console.log("Created", agent.metadata.name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
