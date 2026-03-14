import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "service-due" | "in-shop" | "storage" | "completed" | "scheduled" | "overdue";
  className?: string;
}

const statusConfig = {
  active: { label: "ACTIVE", className: "bg-success/15 text-success" },
  "service-due": { label: "SERVICE DUE", className: "bg-warning/15 text-warning" },
  "in-shop": { label: "IN SHOP", className: "bg-accent/15 text-accent" },
  storage: { label: "STORAGE", className: "bg-info/15 text-info" },
  completed: { label: "COMPLETED", className: "bg-success/15 text-success" },
  scheduled: { label: "SCHEDULED", className: "bg-info/15 text-info" },
  overdue: { label: "OVERDUE", className: "bg-accent/15 text-accent" },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}