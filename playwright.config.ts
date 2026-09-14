import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import glob from "glob";

/**
 * Visual regression setup for the Influencer Manager shell.
 *
 * Snapshots are committed under tests/visual/__screenshots__ and compared on
 * every run, so sidebar / banner / top bar drift is caught automatically.
 *
 *   bun run test:visual              # compare against committed snapshots
 *   bun run test:visual:update       # re-baseline after an intentional change
 */
const PORT = Number(process.env["PLAYWRIGHT_PORT"] ?? 8080);
const NIX_CHROMIUM = glob
  .sync("/nix/store/*-playwright-chromium/chrome-linux/chrome")
  .find((p) => existsSync(p));
const CHROMIUM_PATH = process.env["PLAYWRIGHT_CHROMIUM_PATH"] ?? NIX_CHROMIUM;
const launchOptions = CHROMIUM_PATH ? { executablePath: CHROMIUM_PATH } : {};

const BASE_URL = process.env["PLAYWRIGHT_BASE_URL"] ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: process.env["CI"] ? 1 : 0,
  reporter: process.env["CI"] ? "github" : "list",
  expect: {
    // Sub-pixel text rendering differences must not fail the run.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", scale: "css" },
  },
  use: {
    baseURL: BASE_URL,
    colorScheme: "dark",
    timezoneId: "UTC",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, launchOptions },
    },
    {
      name: "tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 834, height: 1112 }, launchOptions },
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: false,
        launchOptions,
      },
    },
  ],
  webServer: process.env["PLAYWRIGHT_BASE_URL"]
    ? undefined
    : {
        command: `vite dev --port ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
