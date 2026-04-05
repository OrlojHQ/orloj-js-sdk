import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../setup.js";
import { OrlojClient } from "../../src/client.js";

const client = new OrlojClient({
  baseUrl: "http://localhost:8080",
  apiToken: "test-token",
});

describe("Auth", () => {
  it("me GETs /v1/auth/me", async () => {
    server.use(
      http.get("http://localhost:8080/v1/auth/me", () =>
        HttpResponse.json({
          authenticated: true,
          name: "alice",
        }),
      ),
    );

    const me = await client.auth.me();
    expect(me.authenticated).toBe(true);
    expect(me.name).toBe("alice");
  });

  it("whoami delegates to me", async () => {
    server.use(
      http.get("http://localhost:8080/v1/auth/me", () =>
        HttpResponse.json({ authenticated: true }),
      ),
    );
    await client.auth.whoami();
  });

  it("health GETs /healthz", async () => {
    server.use(
      http.get("http://localhost:8080/healthz", () =>
        HttpResponse.json({ ok: true }),
      ),
    );

    const h = await client.auth.health();
    expect(h).toEqual({ ok: true });
  });
});
