import type { BaseClient } from "../base-client.js";
import type {
  Memory,
  MemoryEntriesResponse,
  MemoryList,
} from "../types/memory.js";
import { BaseResource } from "./base.js";

export class Memories extends BaseResource<Memory, MemoryList> {
  protected readonly segment = "memories";

  constructor(client: BaseClient) {
    super(client);
  }

  async queryEntries(
    name: string,
    params?: {
      namespace?: string;
      q?: string;
      prefix?: string;
      limit?: number;
    },
  ): Promise<MemoryEntriesResponse> {
    return this.client.requestJson<MemoryEntriesResponse>({
      method: "GET",
      path: `${this.basePath()}/${encodeURIComponent(name)}/entries`,
      params: {
        namespace: this.client.resolveNamespace(params?.namespace),
        q: params?.q,
        prefix: params?.prefix,
        limit: params?.limit,
      },
    });
  }
}
