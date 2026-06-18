import { test, expect } from "@playwright/test";

function uniqueEmail(): string {
  return `e2e-checkout-${Date.now()}@example.com`;
}

test.describe("checkout flow", () => {
  test("signs up, navigates to /admin/billing, clicks Upgrade, reaches /checkout", async ({ page }) => {
    const email = uniqueEmail();
    const tenantId = `e2e-co-${Date.now().toString(36)}`;
    const brandName = `E2E Checkout ${Date.now()}`;

    // Sign up
    await page.goto("/sign-up");
    await page.getByLabel("Brand name").fill(brandName);
    await page.getByLabel(/tenant id/i).fill(tenantId);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("Sup3rSecret!");
    await page.getByLabel("Confirm password").fill("Sup3rSecret!");
    await page.getByRole("button", { name: /create my page/i }).click();
    await page.waitForURL("**/admin", { timeout: 20_000 });

    // Navigate to billing
    await page.goto("/admin/billing");
    await expect(page.getByRole("heading", { name: /billing/i })).toBeVisible();
    await expect(page.getByText(/current plan/i)).toBeVisible();
    await expect(page.getByText(/free forever/i)).toBeVisible();

    // Click upgrade — should land on /checkout
    await page.getByRole("button", { name: /upgrade to premium/i }).first().click();
    await page.waitForURL("**/checkout?plan=premium", { timeout: 10_000 });

    // Checkout page should show order summary
    await expect(page.getByRole("heading", { name: /subscribe to premium/i })).toBeVisible();
    await expect(page.getByText(/order summary/i)).toBeVisible();
    await expect(page.getByText(/rp 30,000/i)).toBeVisible();

    // The CTA either points to Xendit (button) or shows the "not configured" warning
    // Both are valid depending on whether Xendit env vars are set
    const continueButton = page.getByRole("button", { name: /continue to checkout/i });
    const notConfigured = page.getByText(/billing is not configured/i);
    await expect(continueButton.or(notConfigured)).toBeVisible();
  });

  test("/checkout requires authentication", async ({ page }) => {
    // Without login, /checkout should redirect to /sign-up?next=...
    await page.goto("/checkout?plan=premium");
    await page.waitForURL(/\/sign-up/, { timeout: 10_000 });
  });
});
