import type { BaseClient } from "../base-client.js";
import type { TokenInfo, WhoAmI } from "../types/auth.js";

/**
 * Auth and control-plane endpoints per [docs.orloj.dev/reference/api](https://docs.orloj.dev/reference/api).
 */
export class Auth {
  constructor(private readonly client: BaseClient) {}

  /** `GET /v1/auth/me` — current identity (`method`, `name`, `role`). */
  async me(): Promise<WhoAmI> {
    return this.client.requestJson<WhoAmI>({
      method: "GET",
      path: "/v1/auth/me",
    });
  }

  /** Same as {@link me} — `GET /v1/auth/me`. */
  async whoami(): Promise<WhoAmI> {
    return this.me();
  }

  async listTokens(): Promise<TokenInfo[]> {
    const rows = await this.client.requestJson<Record<string, unknown>[]>({
      method: "GET",
      path: "/v1/tokens",
    });
    return rows.map((row): TokenInfo => {
      const name = String(row["name"] ?? "");
      const createdAt = row["createdAt"] ?? row["created_at"];
      return {
        name,
        ...(row["role"] !== undefined && row["role"] !== null
          ? { role: String(row["role"]) }
          : {}),
        ...(row["token"] !== undefined && row["token"] !== null
          ? { token: String(row["token"]) }
          : {}),
        ...(createdAt !== undefined && createdAt !== null
          ? { createdAt: String(createdAt) }
          : {}),
      };
    });
  }

  async createToken(name: string, role: string): Promise<TokenInfo> {
    return this.client.requestJson<TokenInfo>({
      method: "POST",
      path: "/v1/tokens",
      body: { name, role },
    });
  }

  async deleteToken(name: string): Promise<void> {
    await this.client.requestJson<void>({
      method: "DELETE",
      path: `/v1/tokens/${encodeURIComponent(name)}`,
    });
  }

  /** `GET /healthz` — process health (not under `/v1`). */
  async health(): Promise<Record<string, unknown>> {
    return this.client.requestJson<Record<string, unknown>>({
      method: "GET",
      path: "/healthz",
    });
  }

  async capabilities(): Promise<Record<string, unknown>> {
    return this.client.requestJson<Record<string, unknown>>({
      method: "GET",
      path: "/v1/capabilities",
    });
  }

  async listNamespaces(): Promise<string[]> {
    return this.client.requestJson<string[]>({
      method: "GET",
      path: "/v1/namespaces",
    });
  }

  async getAuthConfig(): Promise<Record<string, unknown>> {
    return this.client.requestJson<Record<string, unknown>>({
      method: "GET",
      path: "/v1/auth/config",
    });
  }

  async setup(
    username: string,
    password: string,
    setupToken?: string,
  ): Promise<Record<string, unknown>> {
    return this.client.requestJson<Record<string, unknown>>({
      method: "POST",
      path: "/v1/auth/setup",
      body: {
        username,
        password,
        ...(setupToken !== undefined && { setup_token: setupToken }),
      },
    });
  }

  async login(
    username: string,
    password: string,
  ): Promise<Record<string, unknown>> {
    return this.client.requestJson<Record<string, unknown>>({
      method: "POST",
      path: "/v1/auth/login",
      body: { username, password },
    });
  }

  async logout(): Promise<void> {
    await this.client.requestJson<void>({
      method: "POST",
      path: "/v1/auth/logout",
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.client.requestJson<void>({
      method: "POST",
      path: "/v1/auth/change-password",
      body: { currentPassword, newPassword },
    });
  }

  async listUsers(): Promise<Record<string, unknown>[]> {
    return this.client.requestJson<Record<string, unknown>[]>({
      method: "GET",
      path: "/v1/auth/users",
    });
  }

  async createUser(
    username: string,
    password: string,
    role: string,
  ): Promise<Record<string, unknown>> {
    return this.client.requestJson<Record<string, unknown>>({
      method: "POST",
      path: "/v1/auth/users",
      body: { username, password, role },
    });
  }

  async deleteUser(username: string): Promise<void> {
    await this.client.requestJson<void>({
      method: "DELETE",
      path: `/v1/auth/users/${encodeURIComponent(username)}`,
    });
  }

  /** `POST /v1/auth/admin/reset-password` */
  async adminResetPassword(
    username: string,
    newPassword: string,
  ): Promise<void> {
    await this.client.requestJson<void>({
      method: "POST",
      path: "/v1/auth/admin/reset-password",
      body: { username, new_password: newPassword },
    });
  }
}
