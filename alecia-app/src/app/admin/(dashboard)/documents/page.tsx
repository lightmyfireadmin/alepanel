"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Files, PenTool, PencilLine } from "lucide-react";
import { FilesTab } from "./FilesTab";
import { PadsTab } from "./PadsTab";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-black dark:text-white">Documents & Collaboration</h1>
        <p className="text-bodydark2">Gérez vos fichiers, rédigez vos mémos et collaborez sur vos dossiers.</p>
      </div>

      <Tabs defaultValue="pads" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
          <TabsTrigger value="pads" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Pads</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <Files className="w-4 h-4" />
            <span className="hidden sm:inline">Fichiers</span>
          </TabsTrigger>
          <TabsTrigger value="whiteboards" asChild>
            <Link href="/admin/whiteboard" className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                <span className="hidden sm:inline">Tableau</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="signatures" className="flex items-center gap-2">
            <PencilLine className="w-4 h-4" />
            <span className="hidden sm:inline">Signatures</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pads">
          <PadsTab />
        </TabsContent>

        <TabsContent value="files">
          <FilesTab />
        </TabsContent>

        <TabsContent value="signatures">
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl border-stroke dark:border-strokedark opacity-50">
            <PencilLine className="w-12 h-12 mb-4" />
            <p>Module de signatures électroniques (Docuseal) en cours d&apos;intégration.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}