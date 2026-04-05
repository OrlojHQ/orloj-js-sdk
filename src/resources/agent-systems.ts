import type { BaseClient } from "../base-client.js";
import type { AgentSystem, AgentSystemList } from "../types/agent-system.js";
import { BaseResource } from "./base.js";

export class AgentSystems extends BaseResource<AgentSystem, AgentSystemList> {
  protected readonly segment = "agent-systems";

  constructor(client: BaseClient) {
    super(client);
  }
}
