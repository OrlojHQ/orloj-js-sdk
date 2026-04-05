import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface AgentRoleSpec {
  readonly description?: string;
  readonly permissions?: string[];
}

export interface AgentRoleStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface AgentRole extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "AgentRole";
  readonly metadata: ObjectMeta;
  readonly spec: AgentRoleSpec;
  readonly status?: AgentRoleStatus;
}

export type AgentRoleList = PagedList<AgentRole>;
