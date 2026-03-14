import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, Loader2, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import AddVehicleDialog from "../components/AddVehicleDialog";
import EditVehicleDialog from "../components/EditVehicleDialog";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  vin: string;
  displayName?: string;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] as const } },
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
  
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("https://localhost:7017/api/vehicles", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch vehicles");

      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the garage database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVehicles();
    }
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle? This will also remove all maintenance and expense records associated with it.")) return;

    try {
      const response = await fetch(`https://localhost:7017/api/vehicles/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        fetchVehicles();
      } else {
        setError("Failed to delete vehicle");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to the database to delete.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Opening the garage...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 text-destructive">
        <AlertCircle className="w-12 h-12" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {vehicles.length} {vehicles.length === 1 ? 'machine' : 'machines'} in your garage
          </p>
        </div>
        <AddVehicleDialog onVehicleAdded={fetchVehicles} />
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
          <h3 className="text-lg font-medium text-foreground">No vehicles yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Click the Add Vehicle button to get started.</p>
        </div>
      ) : (
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" animate="show" variants={stagger}>
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              variants={fadeUp}
              className="rounded-xl bg-card glass-shadow hover:glass-shadow-hover hover:-translate-y-0.5 transition-all duration-150 ease-expo overflow-hidden relative group"
            >
              <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="h-7 w-7 bg-background/50 backdrop-blur-sm hover:bg-background/80" onClick={() => setEditingVehicle(vehicle)}>
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button variant="destructive" size="icon" className="h-7 w-7 opacity-80 hover:opacity-100" onClick={() => handleDelete(vehicle.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="h-32 bg-muted/30 flex items-center justify-center relative">
                <Car className="w-16 h-16 text-muted-foreground/30" />
                <div className="absolute top-3 left-3 group-hover:opacity-0 transition-opacity">
                  <StatusBadge status="active" /> 
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="text-base font-semibold text-foreground">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                {vehicle.displayName && (
                  <p className="text-xs text-muted-foreground italic mb-2">"{vehicle.displayName}"</p>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">VIN</span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {vehicle.vin ? `${vehicle.vin.slice(0, 11)}...` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <EditVehicleDialog 
        vehicle={editingVehicle} 
        isOpen={!!editingVehicle} 
        onClose={() => setEditingVehicle(null)} 
        onVehicleUpdated={fetchVehicles} 
      />
    </div>
  );
}