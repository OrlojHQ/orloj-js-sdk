import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface OperationRule {
  /** "read" | "write" | "delete" | "admin" | "*" */
  readonly operationClass?: string;
  /** "allow" | "deny" | "approval_required" */
  readonly verdict?: string;
}

export interface ToolPermissionSpec {
  readonly toolRef?: string;
  readonly action?: string;
  readonly requiredPermissions?: string[];
  /** "all" | "any" */
  readonly matchMode?: string;
  /** "global" | "scoped" */
  readonly applyMode?: string;
  readonly targetAgents?: string[];
  readonly operationRules?: OperationRule[];
}

export interface ToolPermissionStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface ToolPermission extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "ToolPermission";
  readonly metadata: ObjectMeta;
  readonly spec: ToolPermissionSpec;
  readonly status?: ToolPermissionStatus;
}

export type ToolPermissionList = PagedList<ToolPermission>;
