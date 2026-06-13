import { test, expect } from "@playwright/test";

function uniqueEmail(): string {
  const stamp = Date.now();
  return `e2e-${stamp}@example.com`;
}

test.describe("sign-up flow", () => {
  test("signs up, lands on /admin, and sees a default Hero section", async ({ page }) => {
    const email = uniqueEmail();
    const tenantId = `e2e-${Date.now().toString(36)}`;
    const brandName = `E2E Brand ${Date.now()}`;

    await page.goto("/sign-up");

    await expect(page.getByRole("heading", { name: /create your/i })).toBeVisible();

    await page.getByLabel("Brand name").fill(brandName);
    await page.getByLabel(/tenant id/i).fill(tenantId);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("Sup3rSecret!");
    await page.getByLabel("Confirm password").fill("Sup3rSecret!");

    await page.getByRole("button", { name: /create my page/i }).click();

    await page.waitForURL("**/admin", { timeout: 20_000 });

    await expect(page).toHaveURL(/\/admin(\/|$|\?)/);

    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();

    await expect(page.getByRole("link", { name: /sections/i }).first()).toBeVisible();

    await expect(page.getByText(/quick actions/i)).toBeVisible();
  });

  test("rejects mismatched passwords with a clear error", async ({ page }) => {
    await page.goto("/sign-up");

    await page.getByLabel("Brand name").fill("Mismatch Test");
    await page.getByLabel(/tenant id/i).fill("mismatch-test");
    await page.getByLabel("Email").fill("mismatch@example.com");
    await page.getByLabel("Password", { exact: true }).fill("Sup3rSecret!");
    await page.getByLabel("Confirm password").fill("DifferentPassword!");

    await page.getByRole("button", { name: /create my page/i }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });
});
