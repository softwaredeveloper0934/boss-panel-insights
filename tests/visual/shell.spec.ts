import { expect, test, type Page } from "@playwright/test";

/**
 * Pixel checks for the persistent shell (sidebar, module banner, top bar).
 * Runs once per breakpoint project: desktop, tablet, mobile.
 */

/** Freeze motion + hide the caret so snapshots are deterministic. */
async function stabilize(page: Page) {
  await page.addStyleTag({
    content: `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
      html{scroll-behavior:auto!important}`,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

async function gotoHome(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("top-bar")).toBeVisible();
  await stabilize(page);
}

test.describe("shell visual regression", () => {
  test("top bar", async ({ page }, testInfo) => {
    await gotoHome(page);
    await expect(page.getByTestId("top-bar")).toHaveScreenshot(`top-bar-${testInfo.project.name}.png`);
  });

  test("module banner", async ({ page }, testInfo) => {
    await gotoHome(page);
    const banner = page.getByTestId("module-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toHaveScreenshot(`module-banner-${testInfo.project.name}.png`);
  });

  test("sidebar", async ({ page }, testInfo) => {
    await gotoHome(page);
    const sidebar = page.getByTestId("app-sidebar");

    if (await sidebar.isVisible()) {
      // Desktop: docked rail.
      await expect(sidebar).toHaveScreenshot(`sidebar-${testInfo.project.name}.png`);
      return;
    }

    // Tablet/mobile: the sidebar lives in the off-canvas drawer.
    await page.getByRole("button", { name: "Open menu" }).click();
    const drawerSidebar = page.getByTestId("sidebar-drawer");
    await expect(drawerSidebar).toBeVisible();
    await stabilize(page);
    await expect(page).toHaveScreenshot(`sidebar-drawer-${testInfo.project.name}.png`);
  });
});
