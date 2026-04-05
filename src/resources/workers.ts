import type { BaseClient } from "../base-client.js";
import type { Worker, WorkerList } from "../types/worker.js";
import { BaseResource } from "./base.js";

export class Workers extends BaseResource<Worker, WorkerList> {
  protected readonly segment = "workers";

  constructor(client: BaseClient) {
    super(client);
  }
}
