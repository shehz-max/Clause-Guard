"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, AlertTriangle, DollarSign, Bell, Flag } from "lucide-react";

const categoryConfig = {
  expiry: { icon: Clock, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", label: "Expiry" },
  renewal: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", label: "Renewal" },
  payment: { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", label: "Payment" },
  notice: { icon: Bell, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Notice" },
  milestone: { icon: Flag, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", label: "Milestone" },
  other: { icon: Calendar, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", label: "Other" },
};

const urgencyConfig = {
  high: { label: "Urgent", color: "text-red-600 bg-red-50 border-red-100" },
  medium: { label: "Upcoming", color: "text-amber-600 bg-amber-50 border-amber-100" },
  low: { label: "Future", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
};

export function DeadlineTimeline({ keyDates }: { keyDates: any[] }) {
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
      className="bg-white border border-slate-200 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Key Dates & Deadlines</h2>
            <p className="text-sm text-slate-500">Important time-sensitive obligations</p>
          </div>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-100">
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
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className={`w-10 h-10 ${cat.bg} border ${cat.border} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${cat.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900 text-sm">{date.label}</span>
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