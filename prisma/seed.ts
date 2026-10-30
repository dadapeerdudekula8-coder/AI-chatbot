import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Users
  const adminHash = await bcrypt.hash("Admin@123456", 12);
  const agentHash = await bcrypt.hash("Agent@123456", 12);
  const customerHash = await bcrypt.hash("Customer@123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@supportai.dev" },
    update: {},
    create: { email: "admin@supportai.dev", name: "Admin User", passwordHash: adminHash, role: "ADMIN", isActive: true },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@supportai.dev" },
    update: {},
    create: { email: "agent@supportai.dev", name: "Support Agent", passwordHash: agentHash, role: "AGENT", isActive: true },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@supportai.dev" },
    update: {},
    create: { email: "customer@supportai.dev", name: "Jane Customer", passwordHash: customerHash, role: "CUSTOMER", isActive: true },
  });

  console.log(`✅ Users created: admin=${admin.id}, agent=${agent.id}, customer=${customer.id}`);

  // FAQs
  const faqs = [
    { question: "How do I track my order?", answer: "Log in and go to Orders > Track Order. You can also use the tracking number from your confirmation email.", category: "Orders", sortOrder: 1 },
    { question: "What is your return policy?", answer: "We accept returns within 30 days of delivery. Items must be unused and in original packaging. Refunds are processed within 5–7 business days.", category: "Returns", sortOrder: 2 },
    { question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login page and enter your email. You'll receive a reset link within a few minutes.", category: "Account", sortOrder: 3 },
    { question: "Do you offer international shipping?", answer: "Yes! We ship to over 50 countries. International orders typically take 7–14 business days.", category: "Shipping", sortOrder: 4 },
    { question: "How do I cancel my order?", answer: "Orders can be cancelled within 1 hour of placement. After that, you may need to wait for delivery and then request a return.", category: "Orders", sortOrder: 5 },
    { question: "Is my payment information secure?", answer: "All payments are processed through industry-standard encryption. We never store full card details.", category: "Billing", sortOrder: 6 },
    { question: "What payment methods do you accept?", answer: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and direct bank wire transfers for enterprise accounts.", category: "Billing", sortOrder: 7 },
    { question: "How do I change my shipping address?", answer: "If your order has not shipped yet (within 30 minutes of purchase), navigate to Orders > Edit Address. Otherwise, please open an urgent support ticket.", category: "Shipping", sortOrder: 8 },
    { question: "Are refunds issued in the original currency?", answer: "Yes, all refunds are credited back to your original payment method in the exact transaction currency without foreign exchange markup.", category: "Returns", sortOrder: 9 },
    { question: "What should I do if an item arrives damaged?", answer: "Take clear photos of the packaging and damage, then open a ticket under Category: Delivery. We will dispatch a free replacement within 24 hours.", category: "Returns", sortOrder: 10 },
    { question: "How does Two-Factor Authentication (2FA) work?", answer: "Navigate to Dashboard > Settings > Security. Scan the QR code with Google Authenticator or Authy to require a 6-digit one-time code on login.", category: "Account", sortOrder: 11 },
    { question: "What are your customer support hours?", answer: "Our AI assistant is available 24/7/365. Human support agents are online Monday through Friday, 8:00 AM to 8:00 PM EST, with urgent on-call coverage on weekends.", category: "General", sortOrder: 12 },
    { question: "Can I export my chat conversations and ticket history?", answer: "Yes! Go to Conversations or Tickets and click 'Export History' to download a timestamped PDF or CSV transcript.", category: "General", sortOrder: 13 },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { id: `seed-faq-${faq.sortOrder}` },
      update: {},
      create: { id: `seed-faq-${faq.sortOrder}`, ...faq, isActive: true },
    });
  }
  console.log(`✅ ${faqs.length} FAQs seeded`);

  // App settings
  const settings = [
    { key: "chatbot_name", value: "SupportAI Assistant", description: "Display name for the AI chatbot" },
    { key: "max_tokens", value: "1000", description: "Maximum tokens per AI response" },
    { key: "rag_top_k", value: "5", description: "Number of knowledge chunks to retrieve" },
    { key: "rag_min_similarity", value: "0.7", description: "Minimum cosine similarity for retrieval" },
    { key: "rate_limit_chat", value: "30", description: "Max chat requests per user per minute" },
    { key: "fallback_message", value: "I'm not sure about that. Let me connect you with a support agent.", description: "Fallback response" },
  ];

  for (const s of settings) {
    await prisma.appSettings.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("✅ App settings seeded");

  // Sample ticket
  const existingTicket = await prisma.supportTicket.findFirst({ where: { number: 1001 } });
  if (!existingTicket) {
    const ticket = await prisma.supportTicket.create({
      data: {
        subject: "Unable to complete checkout",
        description: "When I try to complete my purchase, I get a payment error on the final step. My card is valid and has sufficient funds.",
        category: "BILLING",
        priority: "HIGH",
        status: "OPEN",
        customerId: customer.id,
        number: 1001,
      },
    });

    await prisma.ticketComment.create({
      data: {
        ticketId: ticket.id,
        authorId: agent.id,
        content: "Hi Jane, thank you for reaching out! I'm looking into the checkout issue for you now. Could you let me know which browser and device you're using?",
        isInternal: false,
      },
    });

    console.log(`✅ Sample ticket created: #${ticket.number}`);
  }
  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Demo credentials:");
  console.log("   Admin:    admin@supportai.dev    / Admin@123456");
  console.log("   Agent:    agent@supportai.dev    / Agent@123456");
  console.log("   Customer: customer@supportai.dev / Customer@123456");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
