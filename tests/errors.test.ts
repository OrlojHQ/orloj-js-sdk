import { describe, it, expect } from "vitest";
import {
  BadRequestError,
  OrlojAPIError,
  OrlojError,
  OrlojTimeoutError,
} from "../src/errors.js";

describe("errors", () => {
  it("OrlojAPIError carries statusCode", () => {
    const err = new BadRequestError(400, "bad");
    expect(err.statusCode).toBe(400);
    expect(err).toBeInstanceOf(OrlojError);
    expect(err).toBeInstanceOf(OrlojAPIError);
  });

  it("OrlojTimeoutError is OrlojError", () => {
    const err = new OrlojTimeoutError("Request timed out");
    expect(err).toBeInstanceOf(OrlojError);
  });
});
