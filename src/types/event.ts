export interface WatchEvent<T> {
  /** "added" | "updated" | "deleted" */
  readonly type: string;
  readonly resource: T;
}

export interface ServerEvent {
  readonly id?: number;
  readonly timestamp?: string;
  readonly source?: string;
  readonly type?: string;
  readonly kind?: string;
  readonly name?: string;
  readonly namespace?: string;
  readonly action?: string;
  readonly message?: string;
}
