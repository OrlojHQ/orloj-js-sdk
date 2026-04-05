/**
 * Maps TypeScript camelCase field names → wire (JSON) field names.
 * Only includes fields that differ between the two. Fields that are identical
 * on both sides (e.g. secretRef on ToolAuth, headerName, tokenURL) are absent
 * and pass through unchanged.
 *
 * TaskWebhookAuthSpec.secretRef is a special case: it is `secret_ref` on
 * the wire (snake_case), unlike ToolAuth.secretRef which is `secretRef` (camelCase).
 * This is handled by the path-aware override in toWire().
 */
export const WIRE_FIELD_MAP: Record<string, string> = {
  // Agent
  modelRef: "model_ref",
  allowedTools: "allowed_tools",
  toolSequence: "tool_sequence",
  requiredOutputMarkers: "required_output_markers",
  duplicateToolCallPolicy: "duplicate_tool_call_policy",
  onContractViolation: "on_contract_violation",
  toolUseBehavior: "tool_use_behavior",
  maxSteps: "max_steps",

  // AgentSystem
  quorumCount: "quorum_count",
  quorumPercent: "quorum_percent",
  onFailure: "on_failure",

  // ModelEndpoint
  baseUrl: "base_url",
  defaultModel: "default_model",

  // Tool
  inputSchema: "input_schema",
  mcpServerRef: "mcp_server_ref",
  mcpToolName: "mcp_tool_name",
  operationClasses: "operation_classes",
  riskLevel: "risk_level",
  stdinFromInput: "stdin_from_input",
  workingDir: "working_dir",
  envFrom: "env_from",
  isolationMode: "isolation_mode",
  maxAttempts: "max_attempts",
  maxBackoff: "max_backoff",

  // Memory
  embeddingModel: "embedding_model",

  // AgentPolicy
  maxTokensPerRun: "max_tokens_per_run",
  allowedModels: "allowed_models",
  blockedTools: "blocked_tools",
  applyMode: "apply_mode",
  targetSystems: "target_systems",
  targetTasks: "target_tasks",

  // ToolPermission
  toolRef: "tool_ref",
  requiredPermissions: "required_permissions",
  matchMode: "match_mode",
  targetAgents: "target_agents",
  operationRules: "operation_rules",
  operationClass: "operation_class",

  // Task
  maxTurns: "max_turns",
  messageRetry: "message_retry",
  nonRetryable: "non_retryable",

  // TaskSchedule
  taskRef: "task_ref",
  timeZone: "time_zone",
  startingDeadlineSeconds: "starting_deadline_seconds",
  concurrencyPolicy: "concurrency_policy",
  successfulHistoryLimit: "successful_history_limit",
  failedHistoryLimit: "failed_history_limit",

  // TaskWebhook (most fields — secretRef handled separately)
  signatureHeader: "signature_header",
  signaturePrefix: "signature_prefix",
  timestampHeader: "timestamp_header",
  maxSkewSeconds: "max_skew_seconds",
  eventIdHeader: "event_id_header",
  dedupeWindowSeconds: "dedupe_window_seconds",
  inputKey: "input_key",

  // Worker
  maxConcurrentTasks: "max_concurrent_tasks",
  supportedModels: "supported_models",

  // McpServer
  toolFilter: "tool_filter",
};

export const TS_FIELD_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(WIRE_FIELD_MAP).map(([ts, wire]) => [wire, ts]),
);

/** Recursively remap keys using the provided field map. */
function remapKeys(obj: unknown, map: Record<string, string>): unknown {
  if (Array.isArray(obj)) return obj.map((item) => remapKeys(item, map));
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        map[key] ?? key,
        remapKeys(value, map),
      ]),
    );
  }
  return obj;
}

/**
 * Convert a TypeScript resource object to wire format before sending.
 * Only the `spec` field is remapped — `metadata` and `status` are already
 * correctly named (camelCase) on the wire.
 */
export function toWire(
  resource: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...resource };

  if (result["spec"]) {
    let spec = remapKeys(result["spec"], WIRE_FIELD_MAP) as Record<
      string,
      unknown
    >;

    if (spec["auth"] && typeof spec["auth"] === "object") {
      const auth = spec["auth"] as Record<string, unknown>;
      if ("secretRef" in auth && resource["kind"] === "TaskWebhook") {
        const { secretRef, ...rest } = auth;
        spec = {
          ...spec,
          auth: {
            ...rest,
            secret_ref: secretRef,
          },
        };
      }
    }

    result["spec"] = spec;
  }

  return result;
}

/**
 * Convert a wire response object to TypeScript field names after receiving.
 * Only the `spec` field is remapped.
 */
export function fromWire(
  resource: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...resource };

  if (result["spec"]) {
    let spec = remapKeys(result["spec"], TS_FIELD_MAP) as Record<
      string,
      unknown
    >;

    if (spec["auth"] && typeof spec["auth"] === "object") {
      const auth = spec["auth"] as Record<string, unknown>;
      if ("secret_ref" in auth && resource["kind"] === "TaskWebhook") {
        const { secret_ref, ...rest } = auth;
        spec = {
          ...spec,
          auth: {
            ...rest,
            secretRef: secret_ref,
          },
        };
      }
    }

    result["spec"] = spec;
  }

  return result;
}

/** Apply fromWire to any nested Orloj resources in API JSON. */
export function transformResponse(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(transformResponse);
  }
  if (data !== null && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (
      "spec" in o &&
      o["spec"] !== null &&
      typeof o["spec"] === "object"
    ) {
      return fromWire(o);
    }
    return Object.fromEntries(
      Object.entries(o).map(([k, v]) => [k, transformResponse(v)]),
    );
  }
  return data;
}
