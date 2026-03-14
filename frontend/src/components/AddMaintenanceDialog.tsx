import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Wrench } from "lucide-react";

interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    displayName?: string;
}

interface AddMaintenanceDialogProps {
    selectedVehicle: Vehicle | undefined;
    onRecordAdded: () => void;
}

export default function AddMaintenanceDialog({ selectedVehicle, onRecordAdded }: AddMaintenanceDialogProps) {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    const [serviceType, setServiceType] = useState("");
    const [milage, setMilage] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState("");
    
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedVehicle) {
            setError("No vehicle selected.");
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            const response = await fetch("https://localhost:7017/api/maintenance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    vehicleId: selectedVehicle.id,
                    serviceType,
                    milageAtService: parseInt(milage) || 0,
                    date: new Date(date).toISOString(),
                    notes
                })
            });

            if (!response.ok) {
                throw new Error("Failed to save maintenance record");
            }

            setServiceType("");
            setMilage("");
            setNotes("");
            setIsOpen(false);
            onRecordAdded();
            
        } catch (err) {
            setError("Could not save the record to the database.");
        } finally {
            setIsSaving(false);
        }
    };

    const vehicleName = selectedVehicle 
        ? `${selectedVehicle.displayName ? `"${selectedVehicle.displayName}" - ` : ''}${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
        : "Unknown Vehicle";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2" disabled={!selectedVehicle}>
                    <Plus className="w-4 h-4" />
                    Add Service Record
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-primary" />
                        Log Maintenance
                    </DialogTitle>
                    <DialogDescription>
                        Record a new service for <span className="font-semibold text-foreground">{vehicleName}</span>.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSave} className="space-y-4 py-2">
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type</Label>
                        <Input id="serviceType" required value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Oil Change, Tire Rotation" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="milage">Mileage</Label>
                            <Input id="milage" type="number" required value={milage} onChange={(e) => setMilage(e.target.value)} placeholder="e.g. 50000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Used synthetic oil" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Record"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}