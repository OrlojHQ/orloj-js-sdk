import {
  AuthenticationError,
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  OrlojAPIError,
  OrlojConnectionError,
  OrlojError,
  OrlojTimeoutError,
  RateLimitError,
  ServiceUnavailableError,
} from "./errors.js";

export async function checkResponse(response: Response): Promise<void> {
  if (response.ok) return;
  const body = await response.text();
  const message = body.trim() || `HTTP ${response.status}`;
  const map: Record<number, new (code: number, msg: string) => OrlojAPIError> =
    {
      400: BadRequestError,
      401: AuthenticationError,
      404: NotFoundError,
      409: ConflictError,
      429: RateLimitError,
      503: ServiceUnavailableError,
    };
  const Cls =
    map[response.status] ??
    (response.status >= 500 ? InternalServerError : OrlojAPIError);
  throw new Cls(response.status, message);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(response: Response): number | undefined {
  const raw = response.headers.get("Retry-After");
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (!Number.isNaN(seconds)) return seconds * 1000;
  const date = Date.parse(raw);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return undefined;
}

export interface TransportRequest {
  readonly method: "GET" | "POST" | "PUT" | "DELETE";
  readonly url: string;
  readonly headers?: Record<string, string>;
  readonly body?: string | undefined;
  readonly timeout?: number | undefined;
  readonly stream?: boolean;
  /** Merged with timeout — when aborted, fetch is cancelled. */
  readonly signal?: AbortSignal | undefined;
}

export interface TransportContext {
  readonly fetchImpl: typeof fetch;
  readonly maxRetries: number;
}

/**
 * Perform fetch with timeout, optional retries (GET only), and error mapping.
 */
export async function transportFetch(
  ctx: TransportContext,
  req: TransportRequest,
): Promise<Response> {
  const canRetry =
    ctx.maxRetries > 0 && req.method === "GET" && !req.stream;

  let lastError: unknown;
  for (let attempt = 0; attempt <= (canRetry ? ctx.maxRetries : 0); attempt++) {
    const merged = new AbortController();
    const timeoutMs =
      req.stream && req.timeout === undefined
        ? undefined
        : (req.timeout ?? 30_000);
    const timer =
      timeoutMs !== undefined && timeoutMs > 0
        ? setTimeout(() => merged.abort(), timeoutMs)
        : undefined;
    if (req.signal) {
      req.signal.addEventListener(
        "abort",
        () => {
          if (timer) clearTimeout(timer);
          merged.abort();
        },
        { once: true },
      );
    }

    try {
      const init: RequestInit = {
        method: req.method,
        signal: merged.signal,
      };
      if (req.headers !== undefined) init.headers = req.headers;
      if (req.body !== undefined) init.body = req.body;
      const response = await ctx.fetchImpl(req.url, init);

      if (timer) clearTimeout(timer);

      if (
        canRetry &&
        attempt < ctx.maxRetries &&
        (response.status === 429 || response.status === 503)
      ) {
        const retryMs =
          parseRetryAfterMs(response) ??
          Math.min(500 * 2 ** attempt, 10_000);
        await sleep(retryMs);
        continue;
      }

      return response;
    } catch (err) {
      if (timer) clearTimeout(timer);
      lastError = err;
      if (err instanceof OrlojError) throw err;
      if (err instanceof DOMException && err.name === "AbortError") {
        if (req.signal?.aborted) {
          throw err;
        }
        throw new OrlojTimeoutError("Request timed out");
      }
      if (
        canRetry &&
        attempt < ctx.maxRetries &&
        err instanceof TypeError
      ) {
        await sleep(Math.min(500 * 2 ** attempt, 10_000));
        continue;
      }
      if (err instanceof TypeError) {
        throw new OrlojConnectionError(
          `Network error: ${(err as Error).message}`,
        );
      }
      throw err;
    }
  }

  if (lastError instanceof Error) {
    throw new OrlojConnectionError(`Network error: ${lastError.message}`);
  }
  throw new OrlojConnectionError("Network error");
}
