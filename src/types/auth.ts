export interface WhoAmI {
  readonly authenticated: boolean;
  readonly username?: string;
  /** Present on `/v1/auth/me` responses (see docs.orloj.dev). */
  readonly name?: string;
  readonly role?: string;
  readonly method?: string;
}

export interface TokenInfo {
  readonly name: string;
  readonly role?: string;
  /** Only present on create response. */
  readonly token?: string;
  readonly createdAt?: string;
}

export interface NamedLogsResponse {
  readonly name: string;
  readonly logs: Record<string, unknown>[];
}
