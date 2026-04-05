import type { BaseClient } from "../base-client.js";
import type {
  ToolPermission,
  ToolPermissionList,
} from "../types/tool-permission.js";
import { BaseResource } from "./base.js";

export class ToolPermissions extends BaseResource<
  ToolPermission,
  ToolPermissionList
> {
  protected readonly segment = "tool-permissions";

  constructor(client: BaseClient) {
    super(client);
  }
}
