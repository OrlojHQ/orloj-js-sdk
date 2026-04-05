import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { ReadableStream } from "node:stream/web";
import { server } from "./setup.js";
import { OrlojClient } from "../src/client.js";

const client = new OrlojClient({
  baseUrl: "http://localhost:8080",
  apiToken: "test-token",
});

function makeSSEStream(events: string[]): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(event));
      }
      controller.close();
    },
  });
}

describe("SSE streaming", () => {
  it("parses watch events from SSE stream", async () => {
    const ssePayload = [
      "event: resource\n",
      'data: {"type":"updated","resource":{"apiVersion":"orloj.dev/v1","kind":"Task","metadata":{"name":"t1"},"spec":{},"status":{"phase":"Running"}}}\n',
      "\n",
      ": keep-alive\n",
      "\n",
    ];

    server.use(
      http.get("http://localhost:8080/v1/tasks/watch", () =>
        new HttpResponse(makeSSEStream(ssePayload), {
          headers: { "Content-Type": "text/event-stream" },
        }),
      ),
    );

    const events: { type: string; resource: { status?: { phase?: string } } }[] =
      [];
    const stream = client.tasks.watch({ name: "t1" });

    for await (const event of stream) {
      events.push(event);
      stream.abort();
      break;
    }

    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe("updated");
    expect(events[0]?.resource.status?.phase).toBe("Running");
  });
});
