import { motion } from "framer-motion";
import { Car, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { mockVehicles } from "@/data/mockData";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] as const } },
};

export default function VehiclesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockVehicles.length} machines in your garage</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        {mockVehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            variants={fadeUp}
            className="rounded-xl bg-card glass-shadow hover:glass-shadow-hover hover:-translate-y-0.5 transition-all duration-150 ease-expo overflow-hidden cursor-pointer"
          >
            {/* Car silhouette area */}
            <div className="h-32 bg-muted/30 flex items-center justify-center relative">
              <Car className="w-16 h-16 text-muted-foreground/30" />
              <div className="absolute top-3 right-3">
                <StatusBadge status={vehicle.status} />
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Odometer</span>
                  <span className="text-sm font-mono font-tabular text-foreground">{vehicle.odometer.toLocaleString()} mi</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Last Service</span>
                  <span className="text-xs text-muted-foreground">{vehicle.lastService}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">VIN</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{vehicle.vin.slice(0, 11)}...</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
