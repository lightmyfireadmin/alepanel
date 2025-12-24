import { getPad } from "@/lib/actions/pads";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PadEditor } from "./PadEditor";

export default async function PadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const result = await getPad(id);

  if (!result.success || !result.data) {
    return <div>Document non trouvé.</div>;
  }

  const pad = result.data;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/documents"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{pad.title}</h1>
            <p className="text-xs text-bodydark2">ID: {pad.id}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-stroke dark:border-strokedark shadow-sm flex flex-col bg-[var(--card)]">
        <PadEditor id={pad.id} initialContent={pad.content || ""} initialTitle={pad.title} />
      </div>
    </div>
  );
}
