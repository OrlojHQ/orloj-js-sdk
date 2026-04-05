import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface GraphRoute {
  readonly to?: string;
  readonly labels?: Record<string, string>;
  readonly policy?: Record<string, string>;
}

export interface GraphJoin {
  /** "wait_for_all" | "quorum" */
  readonly mode?: string;
  readonly quorumCount?: number;
  readonly quorumPercent?: number;
  /** "deadletter" | "skip" | "continue_partial" */
  readonly onFailure?: string;
}

export interface GraphEdge {
  /** Legacy single-hop edge. */
  readonly next?: string;
  readonly edges?: GraphRoute[];
  readonly join?: GraphJoin;
}

export interface AgentSystemSpec {
  readonly agents?: string[];
  readonly graph?: Record<string, GraphEdge>;
}

export interface AgentSystemStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface AgentSystem extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "AgentSystem";
  readonly metadata: ObjectMeta;
  readonly spec: AgentSystemSpec;
  readonly status?: AgentSystemStatus;
}

export type AgentSystemList = PagedList<AgentSystem>;
