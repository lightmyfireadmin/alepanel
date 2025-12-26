import { ChartBuilder } from "@/components/admin/charts/ChartBuilder";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";

export default function ChartsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Générateur de Graphiques" />
      <ChartBuilder />
    </div>
  );
}
