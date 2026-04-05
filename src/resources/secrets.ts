import type { BaseClient } from "../base-client.js";
import type { Secret, SecretList } from "../types/secret.js";
import { BaseResource } from "./base.js";

export class Secrets extends BaseResource<Secret, SecretList> {
  protected readonly segment = "secrets";

  constructor(client: BaseClient) {
    super(client);
  }
}
