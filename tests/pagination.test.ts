import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup.js";
import { OrlojClient } from "../src/client.js";

const client = new OrlojClient({
  baseUrl: "http://localhost:8080",
  apiToken: "test-token",
});

describe("Pagination", () => {
  it("listAll follows continuation cursor", async () => {
    server.use(
      http.get("http://localhost:8080/v1/agents", ({ request }) => {
        const after = new URL(request.url).searchParams.get("after");
        if (!after) {
          return HttpResponse.json({
            items: [
              {
                apiVersion: "orloj.dev/v1",
                kind: "Agent",
                metadata: { name: "agent-1" },
                spec: {},
              },
            ],
            continue: "cursor-abc",
          });
        }
        return HttpResponse.json({
          items: [
            {
              apiVersion: "orloj.dev/v1",
              kind: "Agent",
              metadata: { name: "agent-2" },
              spec: {},
            },
          ],
        });
      }),
    );

    const all = await client.agents.listAll();
    expect(all).toHaveLength(2);
    expect(all[0]?.metadata.name).toBe("agent-1");
    expect(all[1]?.metadata.name).toBe("agent-2");
  });
});
