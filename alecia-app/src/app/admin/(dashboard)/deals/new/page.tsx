import { DealForm } from "@/components/admin/deal-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Nouvelle opération",
};

export default function NewDealPage() {
  return <DealForm mode="create" />;
}
