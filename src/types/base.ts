export interface ObjectMeta {
  readonly name: string;
  readonly namespace?: string;
  readonly labels?: Record<string, string>;
  readonly annotations?: Record<string, string>;
  readonly resourceVersion?: string;
  readonly generation?: number;
  readonly createdAt?: string;
}

export interface ListMeta {
  readonly continue?: string;
}

/**
 * List response shape per [docs.orloj.dev](https://docs.orloj.dev/reference/api):
 * `continue` and `items` at the top level. Some responses may nest the cursor under `metadata.continue` instead.
 */
export interface PagedList<T> {
  readonly items: T[];
  readonly continue?: string;
  readonly metadata?: ListMeta;
}

export interface StatusEnvelope {
  readonly phase?: string;
  readonly lastError?: string;
  readonly observedGeneration?: number;
}

/** Every Orloj resource has these top-level fields. */
export interface OrlojResource {
  readonly apiVersion: string;
  readonly kind: string;
  readonly metadata: ObjectMeta;
}

/** Input type for creating/updating resources — metadata.name is required. */
export type ResourceInput<T extends OrlojResource> = Omit<T, "status"> & {
  readonly metadata: ObjectMeta & { readonly name: string };
};
