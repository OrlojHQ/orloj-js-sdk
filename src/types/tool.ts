import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface ToolCliEnvRef {
  readonly name: string;
  readonly secretRef: string;
  readonly key?: string;
}

export interface ToolCliSpec {
  readonly command?: string;
  readonly args?: string[];
  readonly image?: string;
  readonly network?: string;
  readonly stdinFromInput?: boolean;
  /** "stdout" | "stderr" | "both" */
  readonly output?: string;
  readonly workingDir?: string;
  readonly env?: Record<string, string>;
  readonly envFrom?: ToolCliEnvRef[];
}

export interface ToolAuth {
  /** "bearer" | "api_key_header" | "basic" | "oauth2_client_credentials" */
  readonly profile?: string;
  readonly secretRef?: string;
  readonly headerName?: string;
  readonly tokenURL?: string;
  readonly scopes?: string[];
}

export interface ToolRetryPolicy {
  readonly maxAttempts?: number;
  readonly backoff?: string;
  readonly maxBackoff?: string;
  /** "none" | "full" | "equal" */
  readonly jitter?: string;
}

export interface ToolRuntimePolicy {
  readonly timeout?: string;
  /** "none" | "sandboxed" | "container" | "wasm" */
  readonly isolationMode?: string;
  readonly retry?: ToolRetryPolicy;
}

export interface ToolSpec {
  /** "http" | "external" | "grpc" | "queue" | "webhook-callback" | "mcp" | "wasm" | "cli" */
  readonly type?: string;
  readonly endpoint?: string;
  readonly description?: string;
  readonly inputSchema?: Record<string, unknown>;
  readonly mcpServerRef?: string;
  readonly mcpToolName?: string;
  readonly cli?: ToolCliSpec;
  readonly capabilities?: string[];
  /** "read" | "write" | "delete" | "admin" */
  readonly operationClasses?: string[];
  /** "low" | "medium" | "high" | "critical" */
  readonly riskLevel?: string;
  readonly runtime?: ToolRuntimePolicy;
  readonly auth?: ToolAuth;
}

export interface ToolStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface Tool extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "Tool";
  readonly metadata: ObjectMeta;
  readonly spec: ToolSpec;
  readonly status?: ToolStatus;
}

export type ToolList = PagedList<Tool>;
