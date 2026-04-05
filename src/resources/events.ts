import type { BaseClient } from "../base-client.js";
import { WatchStream } from "../streaming.js";
import type { ServerEvent } from "../types/event.js";

export class Events {
  constructor(private readonly client: BaseClient) {}

  watch(params?: {
    since?: number;
    source?: string;
    type?: string;
    kind?: string;
    name?: string;
    namespace?: string;
  }): WatchStream<ServerEvent> {
    return new WatchStream<ServerEvent>(
      (signal) =>
        this.client.requestStream({
          method: "GET",
          path: "/v1/events/watch",
          params: {
            since: params?.since,
            source: params?.source,
            type: params?.type,
            kind: params?.kind,
            name: params?.name,
            namespace: params?.namespace,
          },
          signal,
        }),
      (data) => {
        try {
          return JSON.parse(data) as ServerEvent;
        } catch {
          return null;
        }
      },
    );
  }
}
