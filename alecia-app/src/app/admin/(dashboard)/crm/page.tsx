import { getContacts, getCompanies } from "@/lib/actions/crm";
import { CRMClient } from "./CRMClient";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";

export default async function CRMPage() {
  const [contactsRes, companiesRes] = await Promise.all([
    getContacts(),
    getCompanies()
  ]);

  const initialContacts = contactsRes.success ? contactsRes.data || [] : [];
  const initialCompanies = companiesRes.success ? companiesRes.data || [] : [];

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="CRM Database" />
      <CRMClient initialContacts={initialContacts} initialCompanies={initialCompanies} />
    </div>
  );
}