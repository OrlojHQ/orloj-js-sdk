import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface MemoryAuthConfig {
  readonly secretRef?: string;
}

export interface MemoryConfig {
  readonly type?: string;
  readonly provider?: string;
  readonly embeddingModel?: string;
  readonly endpoint?: string;
  readonly auth?: MemoryAuthConfig;
}

export interface MemoryStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface Memory extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "Memory";
  readonly metadata: ObjectMeta;
  readonly spec: MemoryConfig;
  readonly status?: MemoryStatus;
}

export type MemoryList = PagedList<Memory>;

export interface MemoryEntry {
  readonly key?: string;
  readonly value?: string;
  readonly score?: number;
  readonly metadata?: Record<string, unknown>;
}

export interface MemoryEntriesResponse {
  readonly entries: MemoryEntry[];
  readonly count?: number;
}
