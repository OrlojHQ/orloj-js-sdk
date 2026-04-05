import type { BaseClient } from "../base-client.js";
import { parseWatchJson, WatchStream } from "../streaming.js";
import type { WatchEvent } from "../types/event.js";
import type { TaskWebhook, TaskWebhookList } from "../types/task-webhook.js";
import { BaseResource } from "./base.js";

export class TaskWebhooks extends BaseResource<TaskWebhook, TaskWebhookList> {
  protected readonly segment = "task-webhooks";

  constructor(client: BaseClient) {
    super(client);
  }

  watch(params?: {
    namespace?: string;
    name?: string;
    resourceVersion?: string;
  }): WatchStream<WatchEvent<TaskWebhook>> {
    return new WatchStream<WatchEvent<TaskWebhook>>(
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
      (data) => parseWatchJson<TaskWebhook>(data) as WatchEvent<TaskWebhook>,
    );
  }
}
