import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";
import type { ToolAuth } from "./tool.js";

export interface McpServerEnvVar {
  readonly name: string;
  readonly value?: string;
  readonly secretRef?: string;
}

export interface McpToolFilter {
  readonly include?: string[];
}

export interface McpReconnectPolicy {
  readonly maxAttempts?: number;
  readonly backoff?: string;
}

export interface McpServerSpec {
  /** "stdio" | "http" */
  readonly transport: string;
  readonly command?: string;
  readonly args?: string[];
  readonly env?: McpServerEnvVar[];
  readonly endpoint?: string;
  readonly auth?: ToolAuth;
  readonly toolFilter?: McpToolFilter;
  readonly reconnect?: McpReconnectPolicy;
}

export interface McpServerStatus {
  readonly phase?: string;
  readonly discoveredTools?: string[];
  readonly generatedTools?: string[];
  readonly lastSyncedAt?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface McpServer extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "McpServer";
  readonly metadata: ObjectMeta;
  readonly spec: McpServerSpec;
  readonly status?: McpServerStatus;
}

export type McpServerList = PagedList<McpServer>;
