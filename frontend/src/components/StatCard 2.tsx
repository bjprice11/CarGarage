import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  index?: number;
}

export default function StatCard({ label, value, subtitle, icon, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.2, 0, 0, 1] }}
      className="p-5 rounded-xl bg-card glass-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
          {label}
        </span>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="text-2xl font-semibold tracking-tight font-tabular text-foreground">
        {value}
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}