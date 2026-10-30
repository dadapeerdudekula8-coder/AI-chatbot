import Link from "next/link";
import { MessageCircle, Ticket, Clock, ThumbsUp, ArrowUpRight } from "lucide-react";

export interface DashboardStatsProps {
  convCount: number;
  ticketCount: number;
  openTickets: number;
  feedbackCount: number;
}

export function StatCards({
  convCount,
  ticketCount,
  openTickets,
  feedbackCount,
}: DashboardStatsProps) {
  const cards = [
    {
      label: "Total Conversations",
      value: convCount,
      subtext: "AI chat threads initiated",
      icon: MessageCircle,
      href: "/conversations",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      iconGradient: "from-blue-500 to-indigo-600",
      accentBorder: "hover:border-blue-500/40",
    },
    {
      label: "Support Tickets",
      value: ticketCount,
      subtext: "Lifetime tickets created",
      icon: Ticket,
      href: "/tickets",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      iconGradient: "from-indigo-500 to-purple-600",
      accentBorder: "hover:border-indigo-500/40",
    },
    {
      label: "Open Tickets",
      value: openTickets,
      subtext: openTickets > 0 ? "Awaiting agent resolution" : "All issues resolved",
      icon: Clock,
      href: "/tickets?status=OPEN",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      iconGradient: "from-amber-500 to-orange-600",
      accentBorder: "hover:border-amber-500/40",
    },
    {
      label: "Helpful Ratings",
      value: feedbackCount,
      subtext: "Positive AI feedback submitted",
      icon: ThumbsUp,
      href: "/conversations",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      iconGradient: "from-emerald-500 to-teal-600",
      accentBorder: "hover:border-emerald-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Link
            key={i}
            href={card.href}
            className={`group relative p-5 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${card.accentBorder}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${card.iconGradient} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="p-1 rounded-lg text-muted-foreground group-hover:text-foreground group-hover:bg-muted/80 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {card.value.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-foreground/90">
                {card.label}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {card.subtext}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
