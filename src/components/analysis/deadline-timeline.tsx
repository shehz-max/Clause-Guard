"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, AlertTriangle, CheckCircle2, RefreshCw, DollarSign, Bell, Flag } from "lucide-react";
import { KeyDate } from "@/lib/analysis/deadline-extractor";

const categoryConfig = {
  expiry: { icon: Clock, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Expiry" },
  renewal: { icon: RefreshCw, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Renewal" },
  payment: { icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Payment" },
  notice: { icon: Bell, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Notice Period" },
  milestone: { icon: Flag, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Milestone" },
  other: { icon: Calendar, color: "text-muted-foreground", bg: "bg-muted/30", border: "border-border/40", label: "Other" },
};

const urgencyConfig = {
  high: { label: "URGENT", color: "text-destructive bg-destructive/10 border-destructive/20" },
  medium: { label: "UPCOMING", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  low: { label: "FUTURE", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

export function DeadlineTimeline({ keyDates }: { keyDates: KeyDate[] }) {
  if (!keyDates || keyDates.length === 0) return null;

  // Sort: High urgency first, then by date type (absolute ones can be sorted by date)
  const sorted = [...keyDates].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  const highCount = sorted.filter(d => d.urgency === 'high').length;
  const mediumCount = sorted.filter(d => d.urgency === 'medium').length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="relative bg-card rounded-[2rem] border border-border/40 shadow-2xl shadow-black/20 overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20 shadow-lg">
            <Calendar className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground tracking-tight">Key Dates & Deadlines</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60">Smart Extraction</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {highCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-xs font-black text-destructive uppercase tracking-widest">{highCount} Urgent</span>
            </div>
          )}
          {mediumCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">{mediumCount} Upcoming</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{sorted.length} Total</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-8 space-y-4">
        {sorted.map((date, i) => {
          const cat = categoryConfig[date.category] || categoryConfig.other;
          const urg = urgencyConfig[date.urgency];
          const Icon = cat.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-5 p-5 rounded-2xl border transition-all hover:scale-[1.01] ${cat.bg} ${cat.border}`}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${cat.bg} ${cat.border}`}>
                <Icon className={`w-5 h-5 ${cat.color}`} strokeWidth={2} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-foreground text-base truncate">{date.label}</span>
                  <span className={`text-[9px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full border ${urg.color}`}>
                    {urg.label}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full border ${cat.border} ${cat.color} opacity-70`}>
                    {cat.label}
                  </span>
                </div>
                <p className={`text-sm font-semibold ${cat.color}`}>
                  {date.type === 'absolute' ? (
                    <>📅 {new Date(date.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</>
                  ) : (
                    <>⏱ {date.date}</>
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
