import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    vin: string;
    displayName?: string;
}

interface EditVehicleDialogProps {
    vehicle: Vehicle | null;
    isOpen: boolean;
    onClose: () => void;
    onVehicleUpdated: () => void;
}

export default function EditVehicleDialog({ vehicle, isOpen, onClose, onVehicleUpdated }: EditVehicleDialogProps) {
    const { token } = useAuth();
    
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [vin, setVin] = useState("");
    const [displayName, setDisplayName] = useState("");
    
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (vehicle) {
            setMake(vehicle.make);
            setModel(vehicle.model);
            setYear(vehicle.year.toString());
            setVin(vehicle.vin || "");
            setDisplayName(vehicle.displayName || "");
        }
    }, [vehicle]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle) return;

        setIsSaving(true);
        setError("");

        try {
            const response = await fetch(`https://localhost:7017/api/vehicles/${vehicle.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: vehicle.id,
                    vin,
                    make,
                    model,
                    year: parseInt(year) || new Date().getFullYear(),
                    displayName
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update vehicle");
            }

            onVehicleUpdated();
            onClose();
        } catch (err) {
            setError("Could not update the vehicle details.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Vehicle</DialogTitle>
                    <DialogDescription>
                        Update the details for your vehicle.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSave} className="space-y-4 py-2">
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="edit-vin">VIN</Label>
                        <Input id="edit-vin" value={vin} onChange={(e) => setVin(e.target.value.toUpperCase())} maxLength={17} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-make">Make</Label>
                            <Input id="edit-make" required value={make} onChange={(e) => setMake(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-model">Model</Label>
                            <Input id="edit-model" required value={model} onChange={(e) => setModel(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-year">Year</Label>
                            <Input id="edit-year" type="number" required value={year} onChange={(e) => setYear(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-displayName">Nickname</Label>
                            <Input id="edit-displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}