import type { BaseClient } from "../base-client.js";
import { collectAll, type Page } from "../pagination.js";
import type {
  OrlojResource,
  PagedList,
  ResourceInput,
  StatusEnvelope,
} from "../types/base.js";

export interface ListParams {
  namespace?: string;
  limit?: number;
  after?: string;
  labelSelector?: string;
}

export abstract class BaseResource<
  T extends OrlojResource,
  TList extends PagedList<T>,
> {
  constructor(protected readonly client: BaseClient) {}

  /** URL segment after `/v1/`, e.g. `agents`. */
  protected abstract readonly segment: string;

  protected basePath(): string {
    return `/v1/${this.segment}`;
  }

  protected nsParams(namespace?: string): { namespace: string } {
    return { namespace: this.client.resolveNamespace(namespace) };
  }

  protected listQuery(
    params?: ListParams,
  ): Record<string, string | number | boolean | undefined> {
    return {
      namespace: this.client.resolveNamespace(params?.namespace),
      limit: params?.limit,
      after: params?.after,
      labelSelector: params?.labelSelector,
    };
  }

  async list(params?: ListParams): Promise<TList> {
    return this.client.requestJson<TList>({
      method: "GET",
      path: this.basePath(),
      params: this.listQuery(params),
    });
  }

  async listAll(
    params?: Omit<ListParams, "after">,
  ): Promise<T[]> {
    return collectAll(async (after) => {
      const listParams: ListParams = {
        ...params,
        ...(after !== undefined ? { after } : {}),
      };
      const result = await this.list(listParams);
      const page: Page<T> = {
        items: result.items,
        ...(result.continue !== undefined ? { continue: result.continue } : {}),
        ...(result.metadata !== undefined
          ? { metadata: result.metadata }
          : {}),
      };
      return page;
    });
  }

  async get(
    name: string,
    params?: { namespace?: string },
  ): Promise<T> {
    return this.client.requestJson<T>({
      method: "GET",
      path: `${this.basePath()}/${encodeURIComponent(name)}`,
      params: params?.namespace !== undefined
        ? this.nsParams(params.namespace)
        : this.nsParams(),
    });
  }

  async create(
    body: ResourceInput<T>,
    params?: { namespace?: string },
  ): Promise<T> {
    return this.client.requestJson<T>({
      method: "POST",
      path: this.basePath(),
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
      body: body as unknown as Record<string, unknown>,
    });
  }

  async update(
    name: string,
    body: ResourceInput<T>,
    params?: { namespace?: string; ifMatch?: string },
  ): Promise<T> {
    const headers: Record<string, string> = {};
    if (params?.ifMatch !== undefined) {
      headers["If-Match"] = params.ifMatch;
    }
    return this.client.requestJson<T>({
      method: "PUT",
      path: `${this.basePath()}/${encodeURIComponent(name)}`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
      headers,
      body: body as unknown as Record<string, unknown>,
    });
  }

  async delete(
    name: string,
    params?: { namespace?: string },
  ): Promise<void> {
    await this.client.requestJson<void>({
      method: "DELETE",
      path: `${this.basePath()}/${encodeURIComponent(name)}`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
    });
  }

  async getStatus(
    name: string,
    params?: { namespace?: string },
  ): Promise<StatusEnvelope> {
    return this.client.requestJson<StatusEnvelope>({
      method: "GET",
      path: `${this.basePath()}/${encodeURIComponent(name)}/status`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
    });
  }

  async updateStatus(
    name: string,
    body: StatusEnvelope,
    params?: { namespace?: string; ifMatch?: string },
  ): Promise<StatusEnvelope> {
    const headers: Record<string, string> = {};
    if (params?.ifMatch !== undefined) {
      headers["If-Match"] = params.ifMatch;
    }
    return this.client.requestJson<StatusEnvelope>({
      method: "PUT",
      path: `${this.basePath()}/${encodeURIComponent(name)}/status`,
      params:
        params?.namespace !== undefined
          ? this.nsParams(params.namespace)
          : this.nsParams(),
      headers,
      body: body as unknown as Record<string, unknown>,
    });
  }
}
