import { MessageSquare, BookOpen, Ticket, BarChart3, Shield, Globe } from "lucide-react";

const features = [
  { icon: MessageSquare, title: "AI Chat Engine", desc: "Gemini-powered conversational AI with streaming responses and conversation context memory." },
  { icon: BookOpen, title: "RAG Knowledge Base", desc: "Upload PDFs, DOCX, and Markdown files. AI answers are grounded in your actual business documents." },
  { icon: Ticket, title: "Ticket Management", desc: "Full ticket lifecycle — create, assign, prioritize, comment, escalate, and resolve with audit trails." },
  { icon: BarChart3, title: "Real Analytics", desc: "Live dashboard metrics from your database: resolution rates, volumes, satisfaction scores, and trends." },
  { icon: Shield, title: "Enterprise Security", desc: "Role-based access control, server-side auth, rate limiting, input validation, and audit logging." },
  { icon: Globe, title: "Multilingual", desc: "Responds in the customer's language automatically — powered by Gemini's multilingual capabilities." },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">A complete platform built for modern customer support teams.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
