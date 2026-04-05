import type { ObjectMeta, OrlojResource, PagedList } from "./base.js";

export interface ModelEndpointAuth {
  readonly secretRef?: string;
}

export interface ModelEndpointSpec {
  /** "openai" | "anthropic" | "ollama" | "azure_openai" */
  readonly provider?: string;
  readonly baseUrl?: string;
  readonly defaultModel?: string;
  readonly options?: Record<string, string>;
  readonly auth?: ModelEndpointAuth;
}

export interface ModelEndpointStatus {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

export interface ModelEndpoint extends OrlojResource {
  readonly apiVersion: "orloj.dev/v1";
  readonly kind: "ModelEndpoint";
  readonly metadata: ObjectMeta;
  readonly spec: ModelEndpointSpec;
  readonly status?: ModelEndpointStatus;
}

export type ModelEndpointList = PagedList<ModelEndpoint>;
