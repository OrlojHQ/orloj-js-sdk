import type { BaseClient } from "../base-client.js";
import type { ToolApproval, ToolApprovalList } from "../types/tool-approval.js";
import { BaseResource } from "./base.js";

export class ToolApprovals extends BaseResource<ToolApproval, ToolApprovalList> {
  protected readonly segment = "tool-approvals";

  constructor(client: BaseClient) {
    super(client);
  }

  async approve(
    name: string,
    params?: { namespace?: string; decidedBy?: string; reason?: string },
  ): Promise<ToolApproval> {
    return this.client.requestJson<ToolApproval>({
      method: "POST",
      path: `${this.basePath()}/${encodeURIComponent(name)}/approve`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
      body: {
        decidedBy: params?.decidedBy,
        reason: params?.reason,
      },
    });
  }

  async deny(
    name: string,
    params?: { namespace?: string; decidedBy?: string; reason?: string },
  ): Promise<ToolApproval> {
    return this.client.requestJson<ToolApproval>({
      method: "POST",
      path: `${this.basePath()}/${encodeURIComponent(name)}/deny`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
      body: {
        decidedBy: params?.decidedBy,
        reason: params?.reason,
      },
    });
  }
}
