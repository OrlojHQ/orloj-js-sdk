import type { BaseClient } from "../base-client.js";
import type { Tool, ToolList } from "../types/tool.js";
import { BaseResource } from "./base.js";

export class Tools extends BaseResource<Tool, ToolList> {
  protected readonly segment = "tools";

  constructor(client: BaseClient) {
    super(client);
  }
}
