import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface AgentPolicySpec {
  readonly maxTokensPerRun?: number;
  readonly allowedModels?: string[];
  readonly blockedTools?: string[];
  /** "scoped" | "global" */
  readonly applyMode?: string;
  readonly targetSystems?: string[];
  readonly targetTasks?: string[];
}

export interface PolicyStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface AgentPolicy extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "AgentPolicy";
  readonly metadata: ObjectMeta;
  readonly spec: AgentPolicySpec;
  readonly status?: PolicyStatus;
}

export type AgentPolicyList = PagedList<AgentPolicy>;
