"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createContact, createCompany } from "@/lib/actions/crm";
import { useToast } from "@/components/ui/toast";
import { Plus, Loader2 } from "lucide-react";

export function CreateEntityDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  // Contact State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRole, setContactRole] = useState("");

  // Company State
  const [companyName, setCompanyName] = useState("");
  const [companySiren, setCompanySiren] = useState("");
  const [companySector, setCompanySector] = useState("");

  const handleCreateContact = async () => {
    if (!contactName) return;
    setLoading(true);
    const res = await createContact({
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      role: contactRole,
    });
    setLoading(false);

    if (res.success) {
      success("Contact créé avec succès");
      setOpen(false);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactRole("");
    } else {
      errorToast("Erreur", res.error as string);
    }
  };

  const handleCreateCompany = async () => {
    if (!companyName) return;
    setLoading(true);
    const res = await createCompany({
      name: companyName,
      siren: companySiren,
      sector: companySector,
    });
    setLoading(false);

    if (res.success) {
      success("Entreprise créée avec succès");
      setOpen(false);
      setCompanyName("");
      setCompanySiren("");
      setCompanySector("");
    } else {
      errorToast("Erreur", res.error as string);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Nouveau
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="contact" className="w-full">
          <DialogHeader>
            <DialogTitle>Ajouter une entrée</DialogTitle>
            <DialogDescription>
              Créez un nouveau contact ou une nouvelle entreprise dans la base CRM.
            </DialogDescription>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="company">Entreprise</TabsTrigger>
            </TabsList>
          </DialogHeader>
          
          <TabsContent value="contact" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Jean Dupont" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="jean@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+33 6 12 34 56 78" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rôle / Poste</Label>
              <Input id="role" value={contactRole} onChange={(e) => setContactRole(e.target.value)} placeholder="CEO, CFO..." />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleCreateContact} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer le contact
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="company" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="siren">SIREN</Label>
              <Input id="siren" value={companySiren} onChange={(e) => setCompanySiren(e.target.value)} placeholder="123 456 789" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sector">Secteur</Label>
              <Input id="sector" value={companySector} onChange={(e) => setCompanySector(e.target.value)} placeholder="Logiciel, BTP..." />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleCreateCompany} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer l&apos;entreprise
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
