"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, AlertTriangle, DollarSign, Bell, Flag } from "lucide-react";
import { KeyDate } from "@/lib/analysis/deadline-extractor";

const categoryConfig = {
  expiry: { icon: Clock, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", label: "Expiry" },
  renewal: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Renewal" },
  payment: { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Payment" },
  notice: { icon: Bell, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Notice" },
  milestone: { icon: Flag, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Milestone" },
  other: { icon: Calendar, color: "text-muted-foreground", bg: "bg-muted/30", border: "border-border/50", label: "Other" },
};

const urgencyConfig = {
  high: { label: "Urgent", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  medium: { label: "Upcoming", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  low: { label: "Future", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
};

export function DeadlineTimeline({ keyDates }: { keyDates: KeyDate[] }) {
  if (!keyDates || keyDates.length === 0) return null;

  const sorted = [...keyDates].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  const urgentCount = sorted.filter(d => d.urgency === 'high').length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card border border-border/50 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Key Dates & Deadlines</h2>
            <p className="text-sm text-muted-foreground">Important time-sensitive obligations</p>
          </div>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            {urgentCount} urgent
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sorted.map((date, i) => {
          const cat = categoryConfig[date.category] || categoryConfig.other;
          const urg = urgencyConfig[date.urgency];
          const Icon = cat.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50"
            >
              <div className={`w-10 h-10 ${cat.bg} border ${cat.border} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${cat.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground text-sm">{date.label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${urg.color}`}>
                    {urg.label}
                  </span>
                </div>
                <p className={`text-sm ${cat.color}`}>
                  {date.type === 'absolute' ? (
                    new Date(date.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  ) : (
                    date.date
                  )}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}