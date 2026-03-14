import { motion } from "framer-motion";
import { Wrench, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { mockMaintenance } from "@/data/mockData";

export default function MaintenancePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Maintenance</h1>
          <p className="text-sm text-muted-foreground mt-1">Service history and upcoming work</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Log Maintenance
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="rounded-xl bg-card glass-shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground border-b border-border">
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Vehicle</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-right px-5 py-3">Odometer</th>
                <th className="text-right px-5 py-3">Cost</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockMaintenance.map((m, i) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="h-12 hover:bg-card-hover transition-colors duration-150 ease-expo"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.type}</p>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{m.vehicleName}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground font-tabular">{m.date}</td>
                  <td className="px-5 py-3 text-right text-sm font-mono font-tabular text-foreground">
                    {m.odometer.toLocaleString()} mi
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold font-tabular text-foreground">
                    ${m.cost.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
