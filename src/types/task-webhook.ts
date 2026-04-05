import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface TaskWebhookAuthSpec {
  /** "generic" | "github" */
  readonly profile?: string;
  readonly secretRef?: string;
  readonly signatureHeader?: string;
  readonly signaturePrefix?: string;
  readonly timestampHeader?: string;
  readonly maxSkewSeconds?: number;
}

export interface TaskWebhookIdempotency {
  readonly eventIdHeader?: string;
  readonly dedupeWindowSeconds?: number;
}

export interface TaskWebhookPayloadSpec {
  /** "raw" */
  readonly mode?: string;
  readonly inputKey?: string;
}

export interface TaskWebhookSpec {
  readonly taskRef?: string;
  readonly suspend?: boolean;
  readonly auth?: TaskWebhookAuthSpec;
  readonly idempotency?: TaskWebhookIdempotency;
  readonly payload?: TaskWebhookPayloadSpec;
}

export interface TaskWebhookStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
  readonly endpointID?: string;
  readonly endpointPath?: string;
  readonly lastDeliveryTime?: string;
  readonly lastEventID?: string;
  readonly lastTriggeredTask?: string;
  readonly acceptedCount?: number;
  readonly duplicateCount?: number;
  readonly rejectedCount?: number;
}

export interface TaskWebhook extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "TaskWebhook";
  readonly metadata: ObjectMeta;
  readonly spec: TaskWebhookSpec;
  readonly status?: TaskWebhookStatus;
}

export type TaskWebhookList = PagedList<TaskWebhook>;
