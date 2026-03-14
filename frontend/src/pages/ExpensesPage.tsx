import { useEffect, useState } from "react";
import { DollarSign, Loader2, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddExpenseDialog from "../components/AddExpenseDialog";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  displayName?: string;
}

interface ExpenseRecord {
  id: number;
  vehicleId: number;
  category: string;
  amount: number;
  date: string;
}

export default function ExpensesPage() {
  const { token } = useAuth();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchExpenses = async () => {
    if (!selectedVehicleId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://localhost:7017/api/expenses/vehicle/${selectedVehicleId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Failed to load expenses", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedVehicleId, token]);

  if (isLoading && vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading financial data...</p>
      </div>
    );
  }

  const selectedVehicle = vehicles.find(v => v.id.toString() === selectedVehicleId);
  
  // Calculate the total cost dynamically
  const totalExpenses = expenses.reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-1">Track fuel, insurance, and other costs</p>
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

          <AddExpenseDialog 
            selectedVehicle={selectedVehicle} 
            onExpenseAdded={fetchExpenses} 
          />
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted bg-card">
          <h3 className="text-lg font-medium text-foreground">No vehicles found</h3>
          <p className="text-sm text-muted-foreground mt-1">You need to add a vehicle before logging expenses.</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted bg-card">
          <DollarSign className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground">No expenses logged</h3>
          <p className="text-sm text-muted-foreground mt-1">Click the button above to log your first expense.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-xl border flex justify-between items-center">
             <span className="font-medium text-muted-foreground">Total Spent</span>
             <span className="text-xl font-bold text-foreground">${totalExpenses.toFixed(2)}</span>
          </div>
          
          <div className="grid gap-4">
            {expenses.map((record) => (
              <div key={record.id} className="p-5 border rounded-xl bg-card shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    {record.category}
                  </h3>
                </div>
                <div className="flex flex-col sm:items-end text-sm text-muted-foreground space-y-1 shrink-0">
                  <div className="text-lg font-bold text-foreground">
                    ${record.amount.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}