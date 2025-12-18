"use client";

import { useState } from "react";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import {
  Plus, Pencil, Trash2, Search, Linkedin
} from "lucide-react";
import { teamMembers as initialTeamMembers } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <>
      <Breadcrumb pageName="Team Management" />

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-5">
         <div className="relative w-full md:w-1/3">
             <input
                 type="text"
                 placeholder="Search team members..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full rounded-md border border-stroke bg-transparent py-2.5 px-5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
             />
             <Search className="absolute right-4 top-3 text-bodydark2 w-5 h-5" />
         </div>

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button onClick={() => handleOpenDialog()} className="rounded-md bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Member
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-boxdark border-stroke dark:border-strokedark text-black dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">
                {editingMember ? "Edit Member" : "New Member"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
               {/* Form */}
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Full Name *</Label>
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
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Role *</Label>
                      <Select
                            value={formData.role}
                            onValueChange={(v) => setFormData({ ...formData, role: v })}
                        >
                            <SelectTrigger className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                            {ROLES.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                  </div>
               </div>

               {/* More fields similar to original page but using standard inputs or wrapped components */}
                <div className="space-y-2">
                    <Label className="text-black dark:text-white">Bio (FR)</Label>
                    <Textarea
                        value={formData.bioFr}
                        onChange={(e) => setFormData({ ...formData, bioFr: e.target.value })}
                        rows={3}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-4 py-2">
                    <Label className="text-black dark:text-white">Active</Label>
                    <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stroke dark:border-strokedark">
                    <button
                        onClick={() => setIsDialogOpen(false)}
                        className="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                        disabled={!formData.name}
                    >
                        Save
                    </button>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className={`rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark ${!member.isActive ? "opacity-60" : ""}`}>
             <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-200">
                     {/* Using next/image would be better but keeping simple for now, relying on src if available */}
                     {member.photo ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                     ) : (
                         <div className="h-full w-full flex items-center justify-center text-xl font-bold text-gray-500">
                             {member.name.charAt(0)}
                         </div>
                     )}
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white">{member.name}</h4>
                    <p className="text-sm text-bodydark2">{member.role}</p>
                </div>
             </div>

             <div className="flex justify-between items-center border-t border-stroke dark:border-strokedark pt-4">
                 <div className="flex gap-2">
                     {member.linkedinUrl && (
                         <a href={member.linkedinUrl} target="_blank" className="text-bodydark2 hover:text-primary">
                             <Linkedin className="w-5 h-5" />
                         </a>
                     )}
                 </div>
                 <div className="flex gap-2">
                     <button onClick={() => handleOpenDialog(member)} className="text-bodydark2 hover:text-primary">
                         <Pencil className="w-5 h-5" />
                     </button>
                     <button onClick={() => handleDelete(member.id)} className="text-bodydark2 hover:text-danger">
                         <Trash2 className="w-5 h-5" />
                     </button>
                 </div>
             </div>
          </div>
        ))}
      </div>

       {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-bodydark2">
          No team members found.
        </div>
      )}
    </>
  );
}
