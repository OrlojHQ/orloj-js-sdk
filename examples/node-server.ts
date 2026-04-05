/**
 * Minimal HTTP server that creates and looks up tasks via the SDK.
 *
 *   ORLOJ_API_TOKEN=... ORLOJ_SERVER=http://127.0.0.1:8080 npx tsx examples/node-server.ts
 *
 *   curl -X POST localhost:3000/research -H 'Content-Type: application/json' \
 *     -d '{"id":"1","topic":"hello"}'
 *   curl localhost:3000/research/<taskName>
 */
import express from "express";
import { OrlojClient } from "../src/index.js";

const app = express();
app.use(express.json());

const orloj = new OrlojClient({});

app.post("/research", async (req, res) => {
  const id = String(req.body?.id ?? "");
  const topic = String(req.body?.topic ?? "");
  const task = await orloj.tasks.create({
    apiVersion: "orloj.dev/v1",
    kind: "Task",
    metadata: { name: `req-${id}` },
    spec: {
      system: "research-pipeline",
      input: { topic },
    },
  });
  res.json({ taskName: task.metadata.name });
});

app.get("/research/:name", async (req, res) => {
  const task = await orloj.tasks.get(req.params.name);
  res.json({
    phase: task.status?.phase,
    output: task.status?.output,
  });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});
