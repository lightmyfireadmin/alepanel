import { Terminal } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
        <Terminal className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">
        Alecia Panel
      </h1>
      <div className="bg-primary h-1 w-12 mx-auto mb-8 rounded-full" />
      <h2 className="text-xl font-medium text-gray-400 mb-4">
        Maintenance en cours
      </h2>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
        Nous mettons à jour Alecia OS pour vous offrir une expérience encore plus fluide. 
        Revenez dans quelques instants.
      </p>
      
      <div className="mt-12 text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold">
        System Status: Updating Core Modules
      </div>
    </div>
  );
}
