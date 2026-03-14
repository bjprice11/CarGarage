import { motion } from "framer-motion";
import { DollarSign, Fuel, Shield, Cog, FileText, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockExpenses } from "@/data/mockData";

const categoryIcons: Record<string, React.ReactNode> = {
  maintenance: <Cog className="w-3.5 h-3.5" />,
  fuel: <Fuel className="w-3.5 h-3.5" />,
  insurance: <Shield className="w-3.5 h-3.5" />,
  parts: <Package className="w-3.5 h-3.5" />,
  registration: <FileText className="w-3.5 h-3.5" />,
  other: <DollarSign className="w-3.5 h-3.5" />,
};

export default function ExpensesPage() {
  const total = mockExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total: <span className="font-semibold font-tabular text-foreground">${total.toLocaleString()}</span>
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Log Expense
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
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Description</th>
                <th className="text-left px-5 py-3">Vehicle</th>
                <th className="text-right px-5 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockExpenses.map((e, i) => (
                <motion.tr
                  key={e.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="h-12 hover:bg-card-hover transition-colors duration-150 ease-expo"
                >
                  <td className="px-5 py-3 text-sm text-muted-foreground font-tabular">{e.date}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-muted-foreground">
                        {categoryIcons[e.category]}
                      </div>
                      <span className="text-sm capitalize text-foreground">{e.category}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">{e.description}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{e.vehicleName}</td>
                  <td className="px-5 py-3 text-right text-sm font-semibold font-tabular text-foreground">
                    ${e.amount.toLocaleString()}
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
