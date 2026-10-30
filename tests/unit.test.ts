import test, { describe, it } from "node:test";
import assert from "node:assert";
import { loginSchema, registerSchema } from "../src/lib/validations/auth";
import { createTicketSchema, updateTicketSchema, ticketFilterSchema } from "../src/lib/validations/tickets";
import { sendMessageSchema, feedbackSchema } from "../src/lib/validations/chat";
import { formatRelativeTime, formatFileSize, truncateText, getTicketStatusColor } from "../src/lib/utils";
import { extractKeywords } from "../src/lib/ai/rag";

describe("Input Validation Tests", () => {
  it("validates login schema properly", () => {
    const valid = loginSchema.safeParse({ email: "user@example.com", password: "Password123" });
    assert.strictEqual(valid.success, true);

    const invalidEmail = loginSchema.safeParse({ email: "invalid-email", password: "Password123" });
    assert.strictEqual(invalidEmail.success, false);

    const shortPassword = loginSchema.safeParse({ email: "user@example.com", password: "123" });
    assert.strictEqual(shortPassword.success, false);
  });

  it("validates register schema properly", () => {
    const valid = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
    assert.strictEqual(valid.success, true);

    const mismatch = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "Password123",
      confirmPassword: "MismatchPassword1",
    });
    assert.strictEqual(mismatch.success, false);
  });

  it("validates ticket creation schema properly", () => {
    const valid = createTicketSchema.safeParse({
      subject: "Billing inquiry",
      description: "My credit card was charged twice for the same subscription.",
      category: "BILLING",
      priority: "HIGH",
    });
    assert.strictEqual(valid.success, true);

    const shortDesc = createTicketSchema.safeParse({
      subject: "Help",
      description: "Too short",
      category: "GENERAL",
      priority: "LOW",
    });
    assert.strictEqual(shortDesc.success, false);
  });

  it("validates chat message schema properly", () => {
    const valid = sendMessageSchema.safeParse({ content: "What is your refund policy?" });
    assert.strictEqual(valid.success, true);

    const empty = sendMessageSchema.safeParse({ content: "" });
    assert.strictEqual(empty.success, false);
  });

  it("validates feedback schema properly", () => {
    // Valid cuid
    const valid = feedbackSchema.safeParse({ messageId: "clh3f2k4m000008l4f4h86m5c", rating: "HELPFUL" });
    assert.strictEqual(valid.success, true);

    const invalidRating = feedbackSchema.safeParse({ messageId: "clh3f2k4m000008l4f4h86m5c", rating: "AWESOME" });
    assert.strictEqual(invalidRating.success, false);
  });
});

describe("Utility Functions Tests", () => {
  it("formats file sizes correctly", () => {
    assert.strictEqual(formatFileSize(0), "0 B");
    assert.strictEqual(formatFileSize(1024), "1.0 KB");
    assert.strictEqual(formatFileSize(1024 * 1024 * 5), "5.0 MB");
  });

  it("truncates text correctly", () => {
    assert.strictEqual(truncateText("Hello World", 5), "Hello…");
    assert.strictEqual(truncateText("Short", 10), "Short");
  });

  it("returns correct ticket status colors", () => {
    assert.ok(getTicketStatusColor("OPEN").includes("blue"));
    assert.ok(getTicketStatusColor("RESOLVED").includes("green"));
  });

  it("formats relative time correctly", () => {
    const now = new Date();
    assert.strictEqual(formatRelativeTime(now), "just now");
  });
});

describe("RAG Keyword Extraction & Stop Words Filtering", () => {
  it("filters common stop words from queries", () => {
    const kws = extractKeywords("How do I reset my password?");
    assert.deepStrictEqual(kws, ["reset", "password"]);
  });

  it("extracts meaningful keywords for returns and refunds", () => {
    const kws = extractKeywords("What is your return policy and how do refunds work?");
    assert.ok(kws.includes("return"));
    assert.ok(kws.includes("policy"));
    assert.ok(kws.includes("refunds"));
    assert.ok(!kws.includes("how"));
    assert.ok(!kws.includes("what"));
  });

  it("returns empty array for pure stop-word questions", () => {
    const kws = extractKeywords("How are you doing?");
    assert.deepStrictEqual(kws, []);
  });
});
