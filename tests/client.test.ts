import { describe, it, expect, vi, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup.js";
import { OrlojClient } from "../src/client.js";

describe("OrlojClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolves base URL from ORLOJ_SERVER and token from ORLOJ_API_TOKEN", async () => {
    vi.stubEnv("ORLOJ_SERVER", "http://orloj-env.example:9090");
    vi.stubEnv("ORLOJ_API_TOKEN", "env-token");

    let authHeader = "";
    server.use(
      http.get("http://orloj-env.example:9090/v1/agents", ({ request }) => {
        authHeader = request.headers.get("authorization") ?? "";
        return HttpResponse.json({ items: [], metadata: {} });
      }),
    );

    const client = new OrlojClient();
    await client.agents.list();

    expect(authHeader).toBe("Bearer env-token");
  });

  it("prefers ORLOJCTL_SERVER over ORLOJ_SERVER", async () => {
    vi.stubEnv("ORLOJ_SERVER", "http://ignored:1");
    vi.stubEnv("ORLOJCTL_SERVER", "http://ctl.example:2");
    vi.stubEnv("ORLOJ_API_TOKEN", "t");

    let hit = false;
    server.use(
      http.get("http://ctl.example:2/v1/agents", () => {
        hit = true;
        return HttpResponse.json({ items: [], metadata: {} });
      }),
    );

    const client = new OrlojClient();
    await client.agents.list();

    expect(hit).toBe(true);
  });
});
