"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

interface TeamMember {
  name: string;
  initials: string;
  photo?: string;
  role?: string; // Adding role
  bio?: string;  // Adding bio
  linkedin?: string;
  email?: string;
}

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export function TeamMemberModal({ isOpen, onClose, member }: TeamMemberModalProps) {
  const t = useTranslations("team");

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-[var(--border)] bg-[var(--card)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-[family-name:var(--font-playfair)]">
            {member.name}
          </DialogTitle>
          <DialogDescription>
             {/* Intentionally empty or role */}
             {member.role || t("memberRole")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-[var(--border)]">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 flex items-center justify-center">
                <span className="text-4xl font-semibold text-[var(--accent)]">
                  {member.initials}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold mb-2">{t("about")}</h4>
              <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                {member.bio || t("defaultBio")}
              </p>
            </div>

            <div className="flex gap-2 mt-auto">
              {member.linkedin && (
                <Button size="sm" variant="outline" asChild className="w-full gap-2">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
              <Button size="sm" className="btn-gold w-full gap-2" asChild>
                <a href={`mailto:${member.email || "contact@alecia.fr"}`}>
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
