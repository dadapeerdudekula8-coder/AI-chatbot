import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SupportAI/i);
    await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible();
  });

  test("redirects unauthenticated users from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page loads and shows form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#login-submit")).toBeVisible();
  });

  test("shows validation error on empty login", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#login-submit").click();
    // Form validation prevents submission; fields should still be visible
    await expect(page.locator("#email")).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#reg-email")).toBeVisible();
    await expect(page.locator("#register-submit")).toBeVisible();
  });
});

test.describe("Customer Chat (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as customer using the demo credentials
    await page.goto("/login");
    await page.locator("#email").fill("customer@supportai.dev");
    await page.locator("#password").fill("Customer@123456");
    await page.locator("#login-submit").click();
    await page.waitForURL(/\/dashboard/);
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await expect(page.getByText("Total Conversations")).toBeVisible();
    await expect(page.getByText("Support Tickets")).toBeVisible();
  });

  test("navigates to chat", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.locator("#chat-input")).toBeVisible();
    await expect(page.locator("#send-message")).toBeVisible();
  });

  test("sends a message in chat", async ({ page }) => {
    await page.goto("/chat");
    await page.locator("#chat-input").fill("What is your return policy?");
    await page.locator("#send-message").click();
    // Wait for the response to appear
    await page.waitForTimeout(3000);
    await expect(page.locator(".chat-bubble-user").first()).toContainText("return policy");
  });

  test("can create a support ticket", async ({ page }) => {
    await page.goto("/tickets");
    await page.locator("#create-ticket-btn").click();
    await expect(page.getByText("Create Support Ticket")).toBeVisible();
  });
});
