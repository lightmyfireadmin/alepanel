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
import { Linkedin, Mail, GraduationCap, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface TeamMember {
  name: string;
  photo?: string;
  role?: string;
  bio?: string;
  linkedinUrl?: string;
  email?: string;
  formation?: string;
  bureau?: string;
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-[var(--border)] bg-[var(--card)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-[family-name:var(--font-playfair)]">
            {member.name}
          </DialogTitle>
          <DialogDescription>
             {member.role || t("memberRole")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-[250px_1fr] gap-6 py-4">
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-[var(--border)]">
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
                    {member.name
                      .split(" ")
                      .map(word => word[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Contact Info */}
            {member.email && (
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-[var(--foreground-muted)]">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--accent)]" />
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Contact</p>
                    <a href={`mailto:${member.email}`} className="hover:text-[var(--accent)] transition-colors">
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Formation */}
            {member.formation && (
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-[var(--foreground-muted)]">
                  <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--accent)]" />
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Formation</p>
                    <p>{member.formation}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bureau */}
            {member.bureau && (
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-[var(--foreground-muted)]">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--accent)]" />
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Bureau</p>
                    <p>{member.bureau}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2 pt-2">
              {member.linkedinUrl && (
                <Button size="sm" variant="outline" asChild className="w-full gap-2">
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[var(--foreground-muted)] text-sm leading-relaxed whitespace-pre-wrap">
                {member.bio || t("defaultBio")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
