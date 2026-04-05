import type { BaseClient } from "../base-client.js";
import { parseWatchJson, WatchStream } from "../streaming.js";
import type { NamedLogsResponse } from "../types/auth.js";
import type { WatchEvent } from "../types/event.js";
import type { Task, TaskList } from "../types/task.js";
import { BaseResource } from "./base.js";

export class Tasks extends BaseResource<Task, TaskList> {
  protected readonly segment = "tasks";

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

  async cancel(
    name: string,
    params?: { namespace?: string; reason?: string },
  ): Promise<void> {
    await this.client.requestJson<void>({
      method: "POST",
      path: `${this.basePath()}/${encodeURIComponent(name)}/cancel`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
      body: { reason: params?.reason },
    });
  }

  async retry(
    name: string,
    params?: { namespace?: string; overrides?: Record<string, string> },
  ): Promise<Task> {
    return this.client.requestJson<Task>({
      method: "POST",
      path: `${this.basePath()}/${encodeURIComponent(name)}/retry`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
      body: { overrides: params?.overrides },
    });
  }

  /**
   * `GET /v1/tasks/{name}/messages` — filter message stream (phase, agents, branch, trace).
   * @see https://docs.orloj.dev/reference/api
   */
  async getMessages(
    name: string,
    params?: {
      namespace?: string;
      phase?: string;
      fromAgent?: string;
      toAgent?: string;
      branchId?: string;
      traceId?: string;
      limit?: number;
    },
  ): Promise<Record<string, unknown>> {
    return this.client.requestJson<Record<string, unknown>>({
      method: "GET",
      path: `${this.basePath()}/${encodeURIComponent(name)}/messages`,
      params: {
        namespace: this.client.resolveNamespace(params?.namespace),
        phase: params?.phase,
        from_agent: params?.fromAgent,
        to_agent: params?.toAgent,
        branch_id: params?.branchId,
        trace_id: params?.traceId,
        limit: params?.limit,
      },
    });
  }

  /** `GET /v1/tasks/{name}/metrics` — totals and per-agent / per-edge rollups. */
  async getMetrics(
    name: string,
    params?: { namespace?: string },
  ): Promise<Record<string, unknown>> {
    return this.client.requestJson<Record<string, unknown>>({
      method: "GET",
      path: `${this.basePath()}/${encodeURIComponent(name)}/metrics`,
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
  }): WatchStream<WatchEvent<Task>> {
    return new WatchStream<WatchEvent<Task>>(
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
      (data) => parseWatchJson<Task>(data) as WatchEvent<Task>,
    );
  }
}
