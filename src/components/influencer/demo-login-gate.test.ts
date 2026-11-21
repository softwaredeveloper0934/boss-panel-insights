import { describe, expect, it } from "vitest";
import { checkDemoCredentials } from "./demo-login-gate";

const ok = {
  username: "Softwarevala@admim.com",
  password: "softwarevala#123456",
  licenseKey: "2345-3456-4567",
  backupKey: "5678-2345-3456",
};

describe("demo super admin login", () => {
  it("accepts the exact demo details", () => expect(checkDemoCredentials(ok)).toBe(true));
  it("rejects a wrong password", () =>
    expect(checkDemoCredentials({ ...ok, password: "softwarevala#12345" })).toBe(false));
  it("rejects a wrong license key", () =>
    expect(checkDemoCredentials({ ...ok, licenseKey: "2345-3456-4568" })).toBe(false));
  it("rejects a wrong backup key", () =>
    expect(checkDemoCredentials({ ...ok, backupKey: "0000-2345-3456" })).toBe(false));
});
