import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../setup.js";
import { OrlojClient } from "../../src/client.js";
import { NotFoundError, AuthenticationError } from "../../src/errors.js";

const client = new OrlojClient({
  baseUrl: "http://localhost:8080",
  apiToken: "test-token",
});

describe("Agents", () => {
  it("lists agents with correct URL and auth header", async () => {
    let capturedRequest: Request | undefined;

    server.use(
      http.get("http://localhost:8080/v1/agents", ({ request }) => {
        capturedRequest = request;
        return HttpResponse.json({ items: [], metadata: {} });
      }),
    );

    await client.agents.list({ namespace: "staging", limit: 10 });

    expect(capturedRequest?.headers.get("authorization")).toBe(
      "Bearer test-token",
    );
    expect(new URL(capturedRequest!.url).searchParams.get("namespace")).toBe(
      "staging",
    );
    expect(new URL(capturedRequest!.url).searchParams.get("limit")).toBe("10");
  });

  it("returns typed Agent objects with spec remapped from wire", async () => {
    server.use(
      http.get("http://localhost:8080/v1/agents", () =>
        HttpResponse.json({
          items: [
            {
              apiVersion: "orloj.dev/v1",
              kind: "Agent",
              metadata: { name: "my-agent", namespace: "default" },
              spec: { model_ref: "gpt-4" },
            },
          ],
          continue: "",
        }),
      ),
    );

    const result = await client.agents.list();
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.metadata.name).toBe("my-agent");
    expect(result.items[0]?.spec.modelRef).toBe("gpt-4");
  });

  it("throws NotFoundError on 404", async () => {
    server.use(
      http.get("http://localhost:8080/v1/agents/missing", () =>
        HttpResponse.text("agent not found", { status: 404 }),
      ),
    );

    await expect(client.agents.get("missing")).rejects.toThrow(NotFoundError);
  });

  it("throws AuthenticationError on 401", async () => {
    server.use(
      http.get("http://localhost:8080/v1/agents", () =>
        HttpResponse.text("unauthorized", { status: 401 }),
      ),
    );

    await expect(client.agents.list()).rejects.toThrow(AuthenticationError);
  });
});
