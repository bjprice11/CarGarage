import { useEffect, useState } from "react";
import { Wrench, Loader2, Calendar, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddMaintenanceDialog from "../components/AddMaintenanceDialog";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  displayName?: string;
}

interface MaintenanceRecord {
  id: number;
  vehicleId: number;
  serviceType: string;
  milageAtService: number;
  date: string;
  notes?: string;
}

export default function MaintenancePage() {
  const { token } = useAuth();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the user's vehicles on initial load
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("https://localhost:7017/api/vehicles", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
          if (data.length > 0) {
            setSelectedVehicleId(data[0].id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to load vehicles", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchVehicles();
  }, [token]);

  // 2. Fetch maintenance records whenever the selected vehicle changes
  const fetchRecords = async () => {
    if (!selectedVehicleId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://localhost:7017/api/maintenance/vehicle/${selectedVehicleId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error("Failed to load records", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedVehicleId, token]);

  if (isLoading && vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading maintenance data...</p>
      </div>
    );
  }
  const selectedVehicle = vehicles.find(v => v.id.toString() === selectedVehicleId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Maintenance Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Track service history for your vehicles</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map(v => (
                <SelectItem key={v.id} value={v.id.toString()}>
                  {v.year} {v.make} {v.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Update the component call to pass the specific vehicle object */}
          <AddMaintenanceDialog 
            selectedVehicle={selectedVehicle} 
            onRecordAdded={fetchRecords} 
          />
        </div>
      </div>

      
      {vehicles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted bg-card">
          <h3 className="text-lg font-medium text-foreground">No vehicles found</h3>
          <p className="text-sm text-muted-foreground mt-1">You need to add a vehicle before logging maintenance.</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted bg-card">
          <Wrench className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground">No service records</h3>
          <p className="text-sm text-muted-foreground mt-1">Click the button above to log your first service.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <div key={record.id} className="p-5 border rounded-xl bg-card shadow-sm flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  {record.serviceType}
                </h3>
                {record.notes && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2 mt-2">
                    <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                    {record.notes}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:items-end text-sm text-muted-foreground space-y-1 shrink-0">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(record.date).toLocaleDateString()}
                </div>
                <div className="font-mono bg-muted/50 px-2 py-1 rounded-md mt-2 inline-block text-xs">
                  {record.milageAtService.toLocaleString()} mi
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}