import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface ToolApprovalSpec {
  readonly taskRef: string;
  readonly tool: string;
  readonly operationClass?: string;
  readonly agent?: string;
  readonly input?: string;
  readonly reason?: string;
  /** Duration string. Default: "10m" */
  readonly ttl?: string;
}

export interface ToolApprovalStatus {
  /** "Pending" | "Approved" | "Denied" | "Expired" */
  readonly phase?: string;
  readonly decision?: string;
  readonly decidedBy?: string;
  readonly decidedAt?: string;
  readonly expiresAt?: string;
}

export interface ToolApproval extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "ToolApproval";
  readonly metadata: ObjectMeta;
  readonly spec: ToolApprovalSpec;
  readonly status?: ToolApprovalStatus;
}

export type ToolApprovalList = PagedList<ToolApproval>;
