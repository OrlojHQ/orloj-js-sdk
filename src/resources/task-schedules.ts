import type { BaseClient } from "../base-client.js";
import { parseWatchJson, WatchStream } from "../streaming.js";
import type { WatchEvent } from "../types/event.js";
import type { TaskSchedule, TaskScheduleList } from "../types/task-schedule.js";
import { BaseResource } from "./base.js";

export class TaskSchedules extends BaseResource<TaskSchedule, TaskScheduleList> {
  protected readonly segment = "task-schedules";

  constructor(client: BaseClient) {
    super(client);
  }

  watch(params?: {
    namespace?: string;
    name?: string;
    resourceVersion?: string;
  }): WatchStream<WatchEvent<TaskSchedule>> {
    return new WatchStream<WatchEvent<TaskSchedule>>(
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
      (data) => parseWatchJson<TaskSchedule>(data) as WatchEvent<TaskSchedule>,
    );
  }
}
