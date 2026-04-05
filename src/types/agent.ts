import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface AgentLimits {
  readonly maxSteps?: number;
  readonly timeout?: string;
}

export interface MemorySpec {
  readonly ref?: string;
  readonly type?: string;
  readonly provider?: string;
  /** Allowed operations: "read" | "write" | "search" | "list" | "ingest" */
  readonly allow?: string[];
}

export interface AgentExecutionSpec {
  /** "dynamic" | "contract" */
  readonly profile?: string;
  readonly toolSequence?: string[];
  readonly requiredOutputMarkers?: string[];
  /** "short_circuit" | "deny" */
  readonly duplicateToolCallPolicy?: string;
  /** "observe" | "non_retryable_error" */
  readonly onContractViolation?: string;
  /** "run_llm_again" | "stop_on_first_tool" */
  readonly toolUseBehavior?: string;
}

export interface AgentSpec {
  readonly modelRef?: string;
  readonly prompt?: string;
  readonly tools?: string[];
  readonly allowedTools?: string[];
  readonly roles?: string[];
  readonly memory?: MemorySpec;
  readonly execution?: AgentExecutionSpec;
  readonly limits?: AgentLimits;
}

export interface AgentStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface Agent extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "Agent";
  readonly metadata: ObjectMeta;
  readonly spec: AgentSpec;
  readonly status?: AgentStatus;
}

export type AgentList = PagedList<Agent>;
