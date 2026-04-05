import type { BaseClient } from "../base-client.js";
import type { AgentPolicy, AgentPolicyList } from "../types/agent-policy.js";
import { BaseResource } from "./base.js";

export class AgentPolicies extends BaseResource<AgentPolicy, AgentPolicyList> {
  protected readonly segment = "agent-policies";

  constructor(client: BaseClient) {
    super(client);
  }
}
