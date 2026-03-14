import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Search } from "lucide-react";

export default function AddVehicleDialog({ onVehicleAdded }: { onVehicleAdded: () => void }) {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    // Form state
    const [vin, setVin] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [displayName, setDisplayName] = useState("");
    
    // Loading and error states
    const [isDecoding, setIsDecoding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleDecodeVin = async () => {
        if (vin.length !== 17) {
            setError("VIN must be exactly 17 characters long.");
            return;
        }

        setIsDecoding(true);
        setError("");

        try {
            const response = await fetch(`https://localhost:7017/api/vehicles/decode/${vin}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Could not decode vehicle");
            }

            const data = await response.json();
            setMake(data.make || "");
            setModel(data.model || "");
            setYear(data.year || "");
        } catch (err) {
            setError("Failed to decode VIN. Please check it or enter details manually.");
        } finally {
            setIsDecoding(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");

        try {
            const response = await fetch("https://localhost:7017/api/vehicles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    vin,
                    make,
                    model,
                    year: parseInt(year) || new Date().getFullYear(),
                    displayName
                })
            });

            if (!response.ok) {
                throw new Error("Failed to save vehicle");
            }

            // Reset form and tell the parent page to refresh the list
            setVin("");
            setMake("");
            setModel("");
            setYear("");
            setDisplayName("");
            setIsOpen(false);
            onVehicleAdded();
            
        } catch (err) {
            setError("Could not save the vehicle to the garage.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Vehicle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a New Vehicle</DialogTitle>
                    <DialogDescription>
                        Enter a VIN to auto-fill details, or type them in manually.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSave} className="space-y-4 py-2">
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
                        <div className="flex gap-2">
                            <Input 
                                id="vin" 
                                value={vin} 
                                onChange={(e) => setVin(e.target.value.toUpperCase())}
                                placeholder="17-character VIN"
                                maxLength={17}
                            />
                            <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={handleDecodeVin}
                                disabled={isDecoding || vin.length !== 17}
                                className="px-3"
                            >
                                {isDecoding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="make">Make</Label>
                            <Input id="make" required value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Audi" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input id="model" required value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Q4 e-tron" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" type="number" required value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2024" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Nickname (Optional)</Label>
                            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Daily Driver" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Vehicle"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}