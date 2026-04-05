import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface WorkerCapabilities {
  readonly gpu?: boolean;
  readonly supportedModels?: string[];
}

export interface WorkerSpec {
  readonly region?: string;
  readonly capabilities?: WorkerCapabilities;
  readonly maxConcurrentTasks?: number;
}

export interface WorkerStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly lastHeartbeat?: string;
  readonly observedGeneration?: number;
  readonly currentTasks?: number;
}

export interface Worker extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "Worker";
  readonly metadata: ObjectMeta;
  readonly spec: WorkerSpec;
  readonly status?: WorkerStatus;
}

export type WorkerList = PagedList<Worker>;
