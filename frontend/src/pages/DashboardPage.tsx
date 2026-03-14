import { motion } from "framer-motion";
import { Car, Wrench, DollarSign, AlertTriangle, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { mockVehicles, mockMaintenance, mockExpenses } from "@/data/mockData";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const totalVehicles = mockVehicles.length;
  const needsAttention = mockVehicles.filter(v => v.status === "service-due" || v.status === "in-shop").length;
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const upcomingMaintenance = mockMaintenance.filter(m => m.status === "scheduled" || m.status === "overdue");
  const recentExpenses = mockExpenses.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Garage Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {needsAttention > 0
            ? `${needsAttention} vehicle${needsAttention > 1 ? "s" : ""} require attention`
            : "All systems nominal"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Vehicles" value={String(totalVehicles)} icon={<Car className="w-4 h-4" />} index={0} />
        <StatCard label="Needs Attention" value={String(needsAttention)} icon={<AlertTriangle className="w-4 h-4" />} index={1} />
        <StatCard label="Total Expenses" value={`$${totalExpenses.toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} index={2} />
        <StatCard label="Upcoming Services" value={String(upcomingMaintenance.length)} icon={<Wrench className="w-4 h-4" />} index={3} />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Upcoming Maintenance — 3/5 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.2, 0, 0, 1] }}
          className="lg:col-span-3 rounded-xl bg-card glass-shadow overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Upcoming Maintenance</h2>
            <Link to="/maintenance" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingMaintenance.map((m) => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-3 hover:bg-card-hover transition-colors duration-150 ease-expo">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{m.type}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.vehicleName}</p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={m.status} />
                  <p className="text-xs text-muted-foreground mt-1 font-tabular">{m.date}</p>
                </div>
              </div>
            ))}
            {upcomingMaintenance.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No upcoming maintenance scheduled.
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Expenses — 2/5 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.2, 0, 0, 1] }}
          className="lg:col-span-2 rounded-xl bg-card glass-shadow overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Expenses</h2>
            <Link to="/expenses" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recentExpenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-5 py-3 hover:bg-card-hover transition-colors duration-150 ease-expo">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{e.description}</p>
                  <p className="text-xs text-muted-foreground truncate">{e.vehicleName}</p>
                </div>
                <span className="text-sm font-semibold font-tabular text-foreground shrink-0 ml-4">
                  ${e.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Vehicle Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45, ease: [0.2, 0, 0, 1] }}
        className="rounded-xl bg-card glass-shadow overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Fleet Status</h2>
          <Link to="/vehicles" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                <th className="text-left px-5 py-3">Vehicle</th>
                <th className="text-left px-5 py-3">VIN</th>
                <th className="text-right px-5 py-3">Odometer</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Last Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-card-hover transition-colors duration-150 ease-expo">
                  <td className="px-5 py-3">
                    <span className="text-sm font-medium text-foreground">
                      {v.year} {v.make} {v.model}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono text-muted-foreground">{v.vin}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm font-mono font-tabular text-foreground">
                      {v.odometer.toLocaleString()} mi
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-muted-foreground">{v.lastService}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
