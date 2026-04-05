import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface TaskRetryPolicy {
  readonly maxAttempts?: number;
  readonly backoff?: string;
}

export interface TaskMessageRetryPolicy {
  readonly maxAttempts?: number;
  readonly backoff?: string;
  readonly maxBackoff?: string;
  /** "none" | "full" | "equal" */
  readonly jitter?: string;
  readonly nonRetryable?: string[];
}

export interface TaskRequirements {
  readonly region?: string;
  readonly gpu?: boolean;
  readonly model?: string;
}

export interface TaskSpec {
  readonly system?: string;
  /** "run" | "template" */
  readonly mode?: string;
  readonly input?: Record<string, string>;
  readonly priority?: string;
  readonly maxTurns?: number;
  readonly retry?: TaskRetryPolicy;
  readonly messageRetry?: TaskMessageRetryPolicy;
  readonly requirements?: TaskRequirements;
}

export interface TaskTraceEvent {
  readonly timestamp?: string;
  readonly stepId?: string;
  readonly attempt?: number;
  readonly step?: number;
  readonly branchId?: string;
  readonly type?: string;
  readonly agent?: string;
  readonly tool?: string;
  readonly toolContractVersion?: string;
  readonly toolRequestId?: string;
  readonly toolAttempt?: number;
  readonly errorCode?: string;
  readonly errorReason?: string;
  readonly retryable?: boolean;
  readonly message?: string;
  readonly latencyMs?: number;
  readonly tokens?: number;
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly tokenUsageSource?: string;
  readonly toolCalls?: number;
  readonly memoryWrites?: number;
  readonly toolAuthProfile?: string;
  readonly toolAuthSecretRef?: string;
}

export interface TaskHistoryEvent {
  readonly timestamp?: string;
  readonly type?: string;
  readonly worker?: string;
  readonly message?: string;
}

export interface TaskMessage {
  readonly timestamp?: string;
  readonly messageId?: string;
  readonly idempotencyKey?: string;
  readonly taskId?: string;
  readonly attempt?: number;
  readonly system?: string;
  readonly fromAgent?: string;
  readonly toAgent?: string;
  readonly branchId?: string;
  readonly parentBranchId?: string;
  readonly type?: string;
  readonly content?: string;
  readonly traceId?: string;
  readonly parentId?: string;
  readonly phase?: string;
  readonly attempts?: number;
  readonly maxAttempts?: number;
  readonly lastError?: string;
  readonly worker?: string;
  readonly processedAt?: string;
  readonly nextAttemptAt?: string;
}

export interface TaskJoinSource {
  readonly messageId?: string;
  readonly fromAgent?: string;
  readonly branchId?: string;
  readonly timestamp?: string;
  readonly payload?: string;
}

export interface TaskJoinState {
  readonly attempt?: number;
  readonly node?: string;
  readonly mode?: string;
  readonly expected?: number;
  readonly quorumRequired?: number;
  readonly activated?: boolean;
  readonly activatedAt?: string;
  readonly activatedBy?: string;
  readonly sources?: TaskJoinSource[];
}

export interface TaskStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly startedAt?: string;
  readonly completedAt?: string;
  readonly nextAttemptAt?: string;
  readonly attempts?: number;
  readonly output?: Record<string, string>;
  readonly assignedWorker?: string;
  readonly claimedBy?: string;
  readonly leaseUntil?: string;
  readonly lastHeartbeat?: string;
  readonly trace?: TaskTraceEvent[];
  readonly history?: TaskHistoryEvent[];
  readonly messages?: TaskMessage[];
  readonly joinStates?: TaskJoinState[];
  readonly observedGeneration?: number;
}

export interface Task extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "Task";
  readonly metadata: ObjectMeta;
  readonly spec: TaskSpec;
  readonly status?: TaskStatus;
}

export type TaskList = PagedList<Task>;
