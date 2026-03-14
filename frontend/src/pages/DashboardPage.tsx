import { useEffect, useState } from "react";
import { Car, Wrench, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  vin: string;
  displayName?: string;
}

interface Expense {
  id: number;
  amount: number;
}

interface Maintenance {
  id: number;
  milageAtService: number;
  date: string;
}

interface VehicleStats extends Vehicle {
  needsService: boolean;
  lastServiceDate: string | null;
}

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<VehicleStats[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalMaintenanceLogs, setTotalMaintenanceLogs] = useState(0);
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const vRes = await fetch("https://localhost:7017/api/vehicles", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!vRes.ok) throw new Error("Failed to fetch vehicles");
        
        const vData: Vehicle[] = await vRes.json();
        
        let totalExp = 0;
        let totalLogs = 0;
        let alertsCount = 0;
        const processedVehicles: VehicleStats[] = [];

        // Fetch expenses and maintenance for all vehicles simultaneously
        const expensesPromises = vData.map(v => 
          fetch(`https://localhost:7017/api/expenses/vehicle/${v.id}`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => res.json())
        );
        const maintenancePromises = vData.map(v => 
          fetch(`https://localhost:7017/api/maintenance/vehicle/${v.id}`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => res.json())
        );

        const expensesResults: Expense[][] = await Promise.all(expensesPromises);
        const maintenanceResults: Maintenance[][] = await Promise.all(maintenancePromises);

        // Process financial totals
        expensesResults.forEach(vehicleExpenses => {
          totalExp += vehicleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        });

        // Process service alerts and log counts
        vData.forEach((vehicle, index) => {
          const vMaint = maintenanceResults[index];
          let needsService = true;
          let lastServiceDate = null;

          // Add this vehicle's service records to the total count
          totalLogs += vMaint.length;

          if (vMaint.length > 0) {
            // Sort by date to find the most recent service
            vMaint.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            const lastDate = new Date(vMaint[0].date);
            lastServiceDate = lastDate.toLocaleDateString();
            
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            if (lastDate >= sixMonthsAgo) {
                needsService = false;
            }
          }

          if (needsService) alertsCount++;

          processedVehicles.push({
            ...vehicle,
            needsService,
            lastServiceDate
          });
        });

        setVehicles(processedVehicles);
        setTotalExpenses(totalExp);
        setTotalMaintenanceLogs(totalLogs);
        setActiveAlerts(alertsCount);

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Calculating garage metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your garage</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={"Total Vehicles: " + vehicles.length.toString()}
          icon={<Car className="w-4 h-4 text-primary" />}
          description="Total cars currently saved in your garage"
        />
        <StatCard
          title="Overall Expenses"
          value={"Overall Expenses: " + `$${totalExpenses.toFixed(2)}`}
          icon={<DollarSign className="w-4 h-4 text-primary" />}
          description="Sum of all financial records across all vehicles"
        />
        <StatCard
          title="Service Records"
          value={"Service Records: " + totalMaintenanceLogs.toString()}
          icon={<Wrench className="w-4 h-4 text-primary" />}
          description="Total number of maintenance events logged"
        />
        <StatCard
          title="Active Alerts"
          value={"Active Alerts: " + activeAlerts.toString()}
          icon={<AlertCircle className={`w-4 h-4 ${activeAlerts > 0 ? "text-destructive" : "text-primary"}`} />}
          description="Vehicles with no service logged in the last 6 months"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Your GarageOverview</h2>
        {vehicles.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed rounded-xl border-muted bg-card">
            <h3 className="text-lg font-medium text-foreground">Your garage is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Navigate to the Vehicles tab to add your first car.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                {v.needsService && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-destructive" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground pr-4">
                    {v.year} {v.make} {v.model}
                  </h3>
                  <Car className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                </div>
                {v.displayName && (
                  <p className="text-sm text-muted-foreground mb-3">"{v.displayName}"</p>
                )}
                <div className="space-y-2 mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Wrench className="w-3 h-3" /> Last Service
                    </span>
                    <span className={v.needsService ? "text-destructive font-medium" : "text-foreground font-medium"}>
                      {v.lastServiceDate || "Never"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}