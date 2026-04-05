import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface SecretSpec {
  /** Base64-encoded values. GET responses show "***" for each key. */
  readonly data?: Record<string, string>;
  /** Write-only plaintext. Converted to base64 on the server. Omitted in GET responses. */
  readonly stringData?: Record<string, string>;
}

export interface SecretStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface Secret extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "Secret";
  readonly metadata: ObjectMeta;
  readonly spec: SecretSpec;
  readonly status?: SecretStatus;
}

export type SecretList = PagedList<Secret>;
