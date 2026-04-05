import type { BaseClient } from "../base-client.js";
import { parseWatchJson, WatchStream } from "../streaming.js";
import type { NamedLogsResponse } from "../types/auth.js";
import type { Agent, AgentList } from "../types/agent.js";
import type { WatchEvent } from "../types/event.js";
import { BaseResource } from "./base.js";

export class Agents extends BaseResource<Agent, AgentList> {
  protected readonly segment = "agents";

  constructor(client: BaseClient) {
    super(client);
  }

  async getLogs(
    name: string,
    params?: { namespace?: string },
  ): Promise<NamedLogsResponse> {
    return this.client.requestJson<NamedLogsResponse>({
      method: "GET",
      path: `${this.basePath()}/${encodeURIComponent(name)}/logs`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
    });
  }

  watch(params?: {
    namespace?: string;
    name?: string;
    resourceVersion?: string;
  }): WatchStream<WatchEvent<Agent>> {
    return new WatchStream<WatchEvent<Agent>>(
      (signal) =>
        this.client.requestStream({
          method: "GET",
          path: `${this.basePath()}/watch`,
          params: {
            namespace: this.client.resolveNamespace(params?.namespace),
            name: params?.name,
            resourceVersion: params?.resourceVersion,
          },
          signal,
        }),
      (data) => parseWatchJson<Agent>(data) as WatchEvent<Agent>,
    );
  }
}
