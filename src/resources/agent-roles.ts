import type { BaseClient } from "../base-client.js";
import type { AgentRole, AgentRoleList } from "../types/agent-role.js";
import { BaseResource } from "./base.js";

export class AgentRoles extends BaseResource<AgentRole, AgentRoleList> {
  protected readonly segment = "agent-roles";

  constructor(client: BaseClient) {
    super(client);
  }
}
