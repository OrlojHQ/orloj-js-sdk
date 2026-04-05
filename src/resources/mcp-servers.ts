import type { BaseClient } from "../base-client.js";
import type { McpServer, McpServerList } from "../types/mcp-server.js";
import { BaseResource } from "./base.js";

export class McpServers extends BaseResource<McpServer, McpServerList> {
  protected readonly segment = "mcp-servers";

  constructor(client: BaseClient) {
    super(client);
  }
}
