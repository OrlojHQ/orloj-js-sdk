import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface TaskScheduleSpec {
  readonly taskRef?: string;
  readonly schedule?: string;
  readonly timeZone?: string;
  readonly suspend?: boolean;
  readonly startingDeadlineSeconds?: number;
  /** "forbid" */
  readonly concurrencyPolicy?: string;
  readonly successfulHistoryLimit?: number;
  readonly failedHistoryLimit?: number;
}

export interface TaskScheduleStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly lastScheduleTime?: string;
  readonly lastSuccessfulTime?: string;
  readonly nextScheduleTime?: string;
  readonly lastTriggeredTask?: string;
  readonly activeRuns?: string[];
  readonly observedGeneration?: number;
}

export interface TaskSchedule extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "TaskSchedule";
  readonly metadata: ObjectMeta;
  readonly spec: TaskScheduleSpec;
  readonly status?: TaskScheduleStatus;
}

export type TaskScheduleList = PagedList<TaskSchedule>;
