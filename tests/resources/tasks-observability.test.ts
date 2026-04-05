import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../setup.js";
import { OrlojClient } from "../../src/client.js";

const client = new OrlojClient({
  baseUrl: "http://localhost:8080",
  apiToken: "test-token",
});

describe("Tasks observability", () => {
  it("GET /v1/tasks/:name/messages passes query params", async () => {
    let search = "";
    server.use(
      http.get("http://localhost:8080/v1/tasks/t1/messages", ({ request }) => {
        search = new URL(request.url).search;
        return HttpResponse.json({ messages: [] });
      }),
    );

    await client.tasks.getMessages("t1", {
      phase: "Pending",
      fromAgent: "a1",
      limit: 10,
    });

    expect(search).toContain("phase=Pending");
    expect(search).toContain("from_agent=a1");
    expect(search).toContain("limit=10");
  });

  it("GET /v1/tasks/:name/metrics", async () => {
    server.use(
      http.get("http://localhost:8080/v1/tasks/t2/metrics", () =>
        HttpResponse.json({ totals: { x: 1 } }),
      ),
    );

    const m = await client.tasks.getMetrics("t2");
    expect(m).toEqual({ totals: { x: 1 } });
  });
});
