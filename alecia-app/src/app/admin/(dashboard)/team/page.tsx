"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Users, Search, Linkedin } from "lucide-react";
import { teamMembers as initialTeamMembers } from "@/lib/data";

interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  bioFr: string;
  bioEn: string;
  sectorsExpertise: string[];
  isActive: boolean;
  displayOrder: number;
}

const INITIAL_TEAM: TeamMember[] = initialTeamMembers.map((m, i) => ({
  ...m,
  email: `${m.slug.split("-")[0]}@alecia.fr`,
  phone: "",
  bioFr: `${m.name} est ${m.role} chez alecia. Fort d'une expérience significative en conseil en fusion-acquisition, il accompagne les dirigeants de PME et ETI dans leurs opérations.`,
  bioEn: `${m.name} is a ${m.role} at alecia. With significant M&A advisory experience, they support SME executives in their operations.`,
  sectorsExpertise: [],
  isActive: true,
  displayOrder: i + 1,
}));

const EMPTY_MEMBER: TeamMember = {
  id: "",
  slug: "",
  name: "",
  role: "",
  photo: "",
  linkedinUrl: "",
  email: "",
  phone: "",
  bioFr: "",
  bioEn: "",
  sectorsExpertise: [],
  isActive: true,
  displayOrder: 99,
};

const ROLES = [
  "Associé fondateur",
  "Associé",
  "Directeur",
  "Manager",
  "Analyste Senior",
  "Analyste",
  "Stagiaire",
];

const SECTORS = [
  "technologies-logiciels",
  "distribution-services-b2b",
  "distribution-services-b2c",
  "sante",
  "immobilier-construction",
  "industries",
  "services-financiers-assurance",
  "agroalimentaire",
  "energie-environnement",
];

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMember>(EMPTY_MEMBER);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.displayOrder - b.displayOrder);

  const activeCount = members.filter((m) => m.isActive).length;

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({ ...member });
    } else {
      setEditingMember(null);
      setFormData({ ...EMPTY_MEMBER, id: Date.now().toString(), displayOrder: members.length + 1 });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) => (m.id === formData.id ? { ...formData } : m))
      );
    } else {
      setMembers((prev) => [...prev, formData]);
    }
    setIsDialogOpen(false);
    setFormData(EMPTY_MEMBER);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce membre ?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const toggleSectorExpertise = (sector: string) => {
    setFormData((prev) => ({
      ...prev,
      sectorsExpertise: prev.sectorsExpertise.includes(sector)
        ? prev.sectorsExpertise.filter((s) => s !== sector)
        : [...prev.sectorsExpertise, sector],
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <Users className="w-6 h-6" />
            Équipe
          </h1>
          <p className="text-[var(--foreground-muted)]">
            {activeCount} membre{activeCount > 1 ? "s" : ""} actif{activeCount > 1 ? "s" : ""} sur {members.length}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-gold">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau membre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--card)] border-[var(--border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--foreground)]">
                {editingMember ? "Modifier le membre" : "Nouveau membre"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom complet *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: formData.slug || generateSlug(name),
                      });
                    }}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="jean-dupont"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Fonction *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ordre d&apos;affichage</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={50}
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean@alecia.fr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 6 00 00 00 00"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>URL Photo</Label>
                  <Input
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="/assets/Equipe_Alecia/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              {/* Bios */}
              <div className="space-y-2">
                <Label>Biographie (FR) *</Label>
                <Textarea
                  value={formData.bioFr}
                  onChange={(e) => setFormData({ ...formData, bioFr: e.target.value })}
                  rows={4}
                  placeholder="Parcours et expertise..."
                />
              </div>

              <div className="space-y-2">
                <Label>Biographie (EN)</Label>
                <Textarea
                  value={formData.bioEn}
                  onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                  rows={4}
                  placeholder="Background and expertise..."
                />
              </div>

              {/* Sectors Expertise */}
              <div className="space-y-2">
                <Label>Expertises sectorielles</Label>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => toggleSectorExpertise(sector)}
                      className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                        formData.sectorsExpertise.includes(sector)
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      {sector.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg">
                <div>
                  <p className="font-medium text-[var(--foreground)]">Membre actif</p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Visible sur le site /equipe
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="btn-gold" 
                  disabled={!formData.name || !formData.slug || !formData.role}
                >
                  {editingMember ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input
          placeholder="Rechercher un membre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Team Grid */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">
            {filteredMembers.length} membres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className={`flex items-center gap-4 p-4 rounded-lg bg-[var(--background-tertiary)] border border-[var(--border)] ${!member.isActive ? "opacity-60" : ""}`}
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={member.photo} alt={member.name} />
                  <AvatarFallback className="bg-[var(--accent)]/20 text-[var(--accent)]">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--foreground)] truncate">
                    {member.name}
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)] truncate">
                    {member.role}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={member.isActive ? "bg-emerald-500/10 text-emerald-400 text-xs" : "text-xs"}
                    >
                      {member.isActive ? "Actif" : "Inactif"}
                    </Badge>
                    {member.linkedinUrl && (
                      <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 text-blue-500" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(member)}
                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(member.id)}
                    className="text-[var(--foreground-muted)] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-[var(--foreground-muted)]">
          Aucun membre trouvé
        </div>
      )}
    </div>
  );
}
