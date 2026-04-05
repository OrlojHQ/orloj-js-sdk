import { OrlojStreamError } from "./errors.js";
import { transformResponse } from "./serialization.js";

export async function* parseSSE(
  response: Response,
): AsyncGenerator<{ event: string; data: string }> {
  const body = response.body;
  if (!body) {
    throw new OrlojStreamError("SSE response has no body");
  }
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";
  let dataLines: string[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith(":")) continue;
        if (line === "") {
          if (dataLines.length > 0) {
            yield { event: eventName, data: dataLines.join("\n") };
          }
          eventName = "message";
          dataLines = [];
        } else if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          dataLines.push(line.slice(5).trim());
        }
      }
    }
    if (dataLines.length > 0) {
      yield { event: eventName, data: dataLines.join("\n") };
    }
  } catch (err) {
    throw new OrlojStreamError(
      err instanceof Error ? err.message : "SSE stream interrupted",
    );
  }
}

export class WatchStream<T> implements AsyncIterable<T> {
  private readonly abortController = new AbortController();

  constructor(
    private readonly request: (signal: AbortSignal) => Promise<Response>,
    private readonly parseEvent: (data: string) => T | null,
  ) {}

  abort(): void {
    this.abortController.abort();
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    const signal = this.abortController.signal;
    const parseEvent = this.parseEvent;
    const req = this.request;

    const gen = (async function* (): AsyncGenerator<T> {
      let response: Response;
      try {
        response = await req(signal);
      } catch (e) {
        if (signal.aborted) return;
        throw new OrlojStreamError(
          e instanceof Error ? e.message : "SSE request failed",
        );
      }
      try {
        for await (const ev of parseSSE(response)) {
          if (signal.aborted) break;
          if (ev.event !== "resource") continue;
          const parsed = parseEvent(ev.data);
          if (parsed !== null) yield parsed;
        }
      } catch (e) {
        if (signal.aborted) return;
        throw e;
      }
    })();

    return gen;
  }
}

/** Parse watch JSON and remap nested resource. */
export function parseWatchJson<R>(data: string): { type: string; resource: R } {
  const json = JSON.parse(data) as Record<string, unknown>;
  const resource = transformResponse(json["resource"]) as R;
  return {
    type: String(json["type"] ?? ""),
    resource,
  } as { type: string; resource: R };
}
