import { BaseClient, readEnv } from "./base-client.js";
import { Auth } from "./resources/auth.js";
import { AgentPolicies } from "./resources/agent-policies.js";
import { AgentRoles } from "./resources/agent-roles.js";
import { AgentSystems } from "./resources/agent-systems.js";
import { Agents } from "./resources/agents.js";
import { Events } from "./resources/events.js";
import { Memories } from "./resources/memories.js";
import { McpServers } from "./resources/mcp-servers.js";
import { ModelEndpoints } from "./resources/model-endpoints.js";
import { Secrets } from "./resources/secrets.js";
import { TaskSchedules } from "./resources/task-schedules.js";
import { TaskWebhooks } from "./resources/task-webhooks.js";
import { Tasks } from "./resources/tasks.js";
import { ToolApprovals } from "./resources/tool-approvals.js";
import { ToolPermissions } from "./resources/tool-permissions.js";
import { Tools } from "./resources/tools.js";
import { Workers } from "./resources/workers.js";

export interface OrlojClientOptions {
  /** Base URL of the Orloj server. Default: http://127.0.0.1:8080 */
  baseUrl?: string;
  /** Bearer token for authentication. */
  apiToken?: string;
  /** Default namespace for all resource operations. Default: "default" */
  namespace?: string;
  /** Request timeout in milliseconds. Default: 30000 */
  timeout?: number;
  /** Number of retries on transient failures (429, 503, network errors). Default: 0 */
  maxRetries?: number;
  /** Custom fetch implementation. Defaults to globalThis.fetch */
  fetch?: typeof fetch;
}

function resolveBaseUrl(explicit?: string): string {
  return (
    explicit ??
    readEnv("ORLOJCTL_SERVER") ??
    readEnv("ORLOJ_SERVER") ??
    "http://127.0.0.1:8080"
  );
}

function resolveApiToken(explicit?: string): string | undefined {
  return (
    explicit ?? readEnv("ORLOJCTL_API_TOKEN") ?? readEnv("ORLOJ_API_TOKEN")
  );
}

export class OrlojClient {
  private readonly _base: BaseClient;

  private _agents?: Agents;
  private _agentSystems?: AgentSystems;
  private _modelEndpoints?: ModelEndpoints;
  private _tools?: Tools;
  private _secrets?: Secrets;
  private _memories?: Memories;
  private _agentPolicies?: AgentPolicies;
  private _agentRoles?: AgentRoles;
  private _toolPermissions?: ToolPermissions;
  private _toolApprovals?: ToolApprovals;
  private _tasks?: Tasks;
  private _taskSchedules?: TaskSchedules;
  private _taskWebhooks?: TaskWebhooks;
  private _workers?: Workers;
  private _mcpServers?: McpServers;
  private _events?: Events;
  private _auth?: Auth;

  constructor(options: OrlojClientOptions = {}) {
    const apiToken = resolveApiToken(options.apiToken);
    this._base = new BaseClient({
      baseUrl: resolveBaseUrl(options.baseUrl),
      ...(apiToken !== undefined ? { apiToken } : {}),
      namespace: options.namespace ?? "default",
      timeout: options.timeout ?? 30_000,
      maxRetries: options.maxRetries ?? 0,
      fetchImpl:
        options.fetch ??
        ((input: RequestInfo | URL, init?: RequestInit) =>
          globalThis.fetch(input, init)),
    });
  }

  get agents(): Agents {
    this._agents ??= new Agents(this._base);
    return this._agents;
  }

  get agentSystems(): AgentSystems {
    this._agentSystems ??= new AgentSystems(this._base);
    return this._agentSystems;
  }

  get modelEndpoints(): ModelEndpoints {
    this._modelEndpoints ??= new ModelEndpoints(this._base);
    return this._modelEndpoints;
  }

  get tools(): Tools {
    this._tools ??= new Tools(this._base);
    return this._tools;
  }

  get secrets(): Secrets {
    this._secrets ??= new Secrets(this._base);
    return this._secrets;
  }

  get memories(): Memories {
    this._memories ??= new Memories(this._base);
    return this._memories;
  }

  get agentPolicies(): AgentPolicies {
    this._agentPolicies ??= new AgentPolicies(this._base);
    return this._agentPolicies;
  }

  get agentRoles(): AgentRoles {
    this._agentRoles ??= new AgentRoles(this._base);
    return this._agentRoles;
  }

  get toolPermissions(): ToolPermissions {
    this._toolPermissions ??= new ToolPermissions(this._base);
    return this._toolPermissions;
  }

  get toolApprovals(): ToolApprovals {
    this._toolApprovals ??= new ToolApprovals(this._base);
    return this._toolApprovals;
  }

  get tasks(): Tasks {
    this._tasks ??= new Tasks(this._base);
    return this._tasks;
  }

  get taskSchedules(): TaskSchedules {
    this._taskSchedules ??= new TaskSchedules(this._base);
    return this._taskSchedules;
  }

  get taskWebhooks(): TaskWebhooks {
    this._taskWebhooks ??= new TaskWebhooks(this._base);
    return this._taskWebhooks;
  }

  get workers(): Workers {
    this._workers ??= new Workers(this._base);
    return this._workers;
  }

  get mcpServers(): McpServers {
    this._mcpServers ??= new McpServers(this._base);
    return this._mcpServers;
  }

  get events(): Events {
    this._events ??= new Events(this._base);
    return this._events;
  }

  get auth(): Auth {
    this._auth ??= new Auth(this._base);
    return this._auth;
  }
}
