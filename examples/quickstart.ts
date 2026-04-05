/**
 * End-to-end demo: model endpoint → agent → system → task → watch.
 * Requires a running Orloj server and valid credentials.
 *
 *   ORLOJ_API_TOKEN=... npx tsx examples/quickstart.ts
 */
import { OrlojClient } from "../src/index.js";

async function main() {
  const client = new OrlojClient({});

  const endpoint = await client.modelEndpoints.create({
    apiVersion: "orloj.dev/v1",
    kind: "ModelEndpoint",
    metadata: { name: "openai-gpt4" },
    spec: {
      provider: "openai",
      defaultModel: "gpt-4o",
      auth: { secretRef: "openai-key" },
    },
  });
  console.log("Model endpoint:", endpoint.metadata.name);

  const agent = await client.agents.create({
    apiVersion: "orloj.dev/v1",
    kind: "Agent",
    metadata: { name: "researcher" },
    spec: {
      modelRef: "openai-gpt4",
      prompt: "You are a research assistant.",
      tools: ["web-search"],
    },
  });
  console.log("Agent:", agent.metadata.name);

  const system = await client.agentSystems.create({
    apiVersion: "orloj.dev/v1",
    kind: "AgentSystem",
    metadata: { name: "research-pipeline" },
    spec: {
      agents: ["researcher"],
      graph: { researcher: {} },
    },
  });
  console.log("Agent system:", system.metadata.name);

  const task = await client.tasks.create({
    apiVersion: "orloj.dev/v1",
    kind: "Task",
    metadata: { name: `research-${Date.now()}` },
    spec: {
      system: "research-pipeline",
      input: { topic: "AI trends in 2026" },
    },
  });
  console.log("Task:", task.metadata.name);

  const stream = client.tasks.watch({ name: task.metadata.name });

  for await (const event of stream) {
    const phase = event.resource.status?.phase;
    console.log(`[${event.type}] phase: ${phase}`);

    if (phase === "Completed") {
      console.log("Output:", event.resource.status?.output);
      stream.abort();
      break;
    }
    if (phase === "Failed") {
      console.error("Error:", event.resource.status?.lastError);
      stream.abort();
      break;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
