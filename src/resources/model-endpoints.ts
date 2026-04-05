import type { BaseClient } from "../base-client.js";
import type { ModelEndpoint, ModelEndpointList } from "../types/model-endpoint.js";
import { BaseResource } from "./base.js";

export class ModelEndpoints extends BaseResource<
  ModelEndpoint,
  ModelEndpointList
> {
  protected readonly segment = "model-endpoints";

  constructor(client: BaseClient) {
    super(client);
  }
}
