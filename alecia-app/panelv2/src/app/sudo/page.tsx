import { ThemeEditor } from "@/components/features/sudo/ThemeEditor";

export default function SudoDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
      <p className="text-muted-foreground">Manage global settings, appearance, and governance rules.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ThemeEditor />
        
        {/* Placeholder for Governance Settings */}
        <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Governance Rules</h3>
            <p className="text-sm text-muted-foreground mb-4">Configure quorum and voting thresholds.</p>
            <div className="p-4 bg-muted/50 rounded flex items-center justify-center h-48 border border-dashed">
                Coming Soon
            </div>
        </div>
      </div>
    </div>
  );
}
