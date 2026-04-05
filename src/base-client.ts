import { transformResponse, toWire } from "./serialization.js";
import { checkResponse, transportFetch } from "./transport.js";
import { SDK_VERSION } from "./version.js";

export interface RequestOptions {
  readonly method: "GET" | "POST" | "PUT" | "DELETE";
  readonly path: string;
  readonly params?: Record<string, string | number | boolean | undefined>;
  readonly body?: unknown;
  readonly headers?: Record<string, string>;
  readonly timeout?: number;
  readonly stream?: boolean;
  readonly signal?: AbortSignal;
}

export function readEnv(key: string): string | undefined {
  try {
    if (typeof process !== "undefined" && process.env) {
      return process.env[key];
    }
  } catch {
    // ignore
  }
  return undefined;
}

function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const pathWithSlash = path.startsWith("/") ? path : `/${path}`;
  const u = new URL(base + pathWithSlash);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        u.searchParams.set(k, String(v));
      }
    }
  }
  return u.toString();
}

function defaultHeaders(
  apiToken: string | undefined,
  stream: boolean,
): Record<string, string> {
  const h: Record<string, string> = {
    "User-Agent": `orloj-js-sdk/${SDK_VERSION}`,
  };
  if (stream) {
    h["Accept"] = "text/event-stream";
  } else {
    h["Accept"] = "application/json";
    h["Content-Type"] = "application/json";
  }
  if (apiToken) {
    h["Authorization"] = `Bearer ${apiToken}`;
  }
  return h;
}

export class BaseClient {
  readonly baseUrl: string;
  readonly apiToken: string | undefined;
  readonly namespace: string;
  readonly timeout: number;
  readonly maxRetries: number;
  readonly fetchImpl: typeof fetch;

  constructor(opts: {
    baseUrl: string;
    apiToken?: string;
    namespace: string;
    timeout: number;
    maxRetries: number;
    fetchImpl: typeof fetch;
  }) {
    this.baseUrl = opts.baseUrl;
    this.apiToken = opts.apiToken;
    this.namespace = opts.namespace;
    this.timeout = opts.timeout;
    this.maxRetries = opts.maxRetries;
    this.fetchImpl = opts.fetchImpl;
  }

  resolveNamespace(ns?: string): string {
    return ns ?? this.namespace;
  }

  async requestJson<T>(options: RequestOptions): Promise<T> {
    const url = buildUrl(this.baseUrl, options.path, options.params);
    const stream = options.stream === true;
    const headers = {
      ...defaultHeaders(this.apiToken, stream),
      ...options.headers,
    };

    let body: string | undefined;
    if (options.body !== undefined) {
      const raw =
        options.body !== null &&
        typeof options.body === "object" &&
        !Array.isArray(options.body)
          ? toWire(options.body as Record<string, unknown>)
          : options.body;
      body = JSON.stringify(raw);
    }

    const response = await transportFetch(
      { fetchImpl: this.fetchImpl, maxRetries: this.maxRetries },
      {
        method: options.method,
        url,
        headers,
        stream,
        ...(body !== undefined && { body }),
        timeout: options.timeout ?? this.timeout,
        ...(options.signal !== undefined && { signal: options.signal }),
      },
    );

    await checkResponse(response);

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text.trim()) {
      return undefined as T;
    }

    const json: unknown = JSON.parse(text);
    return transformResponse(json) as T;
  }

  /** Raw response after ok check — for streaming. */
  async requestStream(options: RequestOptions): Promise<Response> {
    const url = buildUrl(this.baseUrl, options.path, options.params);
    const headers = {
      ...defaultHeaders(this.apiToken, true),
      ...options.headers,
    };

    const response = await transportFetch(
      { fetchImpl: this.fetchImpl, maxRetries: this.maxRetries },
      {
        method: options.method,
        url,
        headers,
        stream: true,
        ...(options.timeout !== undefined && { timeout: options.timeout }),
        ...(options.signal !== undefined && { signal: options.signal }),
      },
    );

    await checkResponse(response);
    return response;
  }
}
