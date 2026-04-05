import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../setup.js";
import { OrlojClient } from "../../src/client.js";

const client = new OrlojClient({
  baseUrl: "http://localhost:8080",
  apiToken: "test-token",
});

describe("Tasks", () => {
  it("POST cancel hits /v1/tasks/:name/cancel with reason", async () => {
    let path = "";
    let body = "";

    server.use(
      http.post("http://localhost:8080/v1/tasks/t1/cancel", async ({ request }) => {
        path = new URL(request.url).pathname;
        body = await request.text();
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await client.tasks.cancel("t1", { reason: "user" });

    expect(path).toBe("/v1/tasks/t1/cancel");
    expect(JSON.parse(body)).toEqual({ reason: "user" });
  });

  it("POST retry hits /v1/tasks/:name/retry", async () => {
    let path = "";

    server.use(
      http.post("http://localhost:8080/v1/tasks/t2/retry", ({ request }) => {
        path = new URL(request.url).pathname;
        return HttpResponse.json({
          apiVersion: "orloj.dev/v1",
          kind: "Task",
          metadata: { name: "t2" },
          spec: {},
        });
      }),
    );

    await client.tasks.retry("t2", { overrides: { k: "v" } });

    expect(path).toBe("/v1/tasks/t2/retry");
  });

  it("GET logs hits /v1/tasks/:name/logs", async () => {
    server.use(
      http.get("http://localhost:8080/v1/tasks/t3/logs", () =>
        HttpResponse.json({ name: "t3", logs: [] }),
      ),
    );

    const logs = await client.tasks.getLogs("t3");
    expect(logs.name).toBe("t3");
  });
});
