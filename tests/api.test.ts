import { test } from "node:test";
import assert from "node:assert";
import { prisma } from "../src/lib/prisma";
import { ragPipeline } from "../src/lib/ai/rag";
import { getAIProvider } from "../src/lib/ai/provider";
import bcrypt from "bcryptjs";

test("Database connectivity and user registration query", async () => {
  const testEmail = `testuser_${Date.now()}@supportai.dev`;
  const passwordHash = await bcrypt.hash("TestPass@123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Integration Tester",
      email: testEmail,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  assert.ok(user.id, "User ID should be generated");
  assert.strictEqual(user.email, testEmail);

  const found = await prisma.user.findUnique({
    where: { email: testEmail },
  });
  assert.ok(found, "User should be found in database");
  assert.strictEqual(found?.name, "Integration Tester");

  // Clean up
  await prisma.user.delete({ where: { id: user.id } });
});

test("RAG pipeline retrieves FAQ answers for order tracking", async () => {
  const result = await ragPipeline("How can I track my order?");
  assert.ok(result, "RAG pipeline should return result");
  assert.ok(result.sources.length > 0, "Should have retrieved FAQ sources");
  assert.ok(
    result.augmentedPrompt.toLowerCase().includes("track") ||
    result.augmentedPrompt.toLowerCase().includes("orders"),
    "Augmented prompt should include order tracking info"
  );
});

test("AI Provider generates grounded response", async () => {
  const provider = getAIProvider();
  const { augmentedPrompt } = await ragPipeline("What is your return policy?");
  const response = await provider.chat([
    { role: "user", content: augmentedPrompt },
  ]);

  assert.ok(response.length > 10, "Response should be non-empty");
  assert.ok(
    response.toLowerCase().includes("return") ||
    response.toLowerCase().includes("refund") ||
    response.toLowerCase().includes("30 days"),
    "Response should contain return policy information"
  );
});

test("Tickets can be created and retrieved with proper autoincrement number", async () => {
  const customer = await prisma.user.findUnique({ where: { email: "customer@supportai.dev" } });
  assert.ok(customer, "Customer must exist");

  const lastTicket = await prisma.supportTicket.findFirst({
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const nextNumber = (lastTicket?.number || 1000) + 1;

  const ticket = await prisma.supportTicket.create({
    data: {
      customerId: customer.id,
      number: nextNumber,
      subject: "Test ticket integration",
      description: "This is a detailed description of the test ticket for verification.",
      category: "TECHNICAL",
      priority: "MEDIUM",
      status: "OPEN",
    },
  });

  assert.ok(ticket.id, "Ticket ID should exist");
  assert.strictEqual(ticket.number, nextNumber);

  // Clean up
  await prisma.supportTicket.delete({ where: { id: ticket.id } });
});
