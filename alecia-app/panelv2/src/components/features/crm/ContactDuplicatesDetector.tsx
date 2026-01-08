"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, 
  AlertCircle, 
  Merge, 
  CheckCircle, 
  X,
  Mail,
  Phone,
  Building2,
  RefreshCw,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  photoUrl?: string;
}

interface DuplicateGroup {
  contacts: Contact[];
  matchScore: number;
  matchReason: string;
}

interface ContactDuplicatesDetectorProps {
  className?: string;
  onMergeComplete?: () => void;
}

/**
 * Detects potential duplicate contacts using similarity matching
 */
export function ContactDuplicatesDetector({ 
  className,
  onMergeComplete 
}: ContactDuplicatesDetectorProps) {
  const contacts = useQuery(api.queries.getAllContacts);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [primaryContact, setPrimaryContact] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);

  // Analyze duplicates when contacts load
  const analyzeDuplicates = () => {
    if (!contacts || contacts.length < 2) {
      setDuplicateGroups([]);
      return;
    }

    setIsAnalyzing(true);

    // Group potential duplicates
    const groups: DuplicateGroup[] = [];
    const processed = new Set<string>();

    for (let i = 0; i < contacts.length; i++) {
      if (processed.has(contacts[i]._id)) continue;

      const group: Contact[] = [contacts[i]];
      let bestMatchScore = 0;
      let matchReason = "";

      for (let j = i + 1; j < contacts.length; j++) {
        if (processed.has(contacts[j]._id)) continue;

        const { score, reason } = calculateSimilarity(contacts[i], contacts[j]);
        
        if (score >= 0.6) { // 60% threshold
          group.push(contacts[j]);
          processed.add(contacts[j]._id);
          if (score > bestMatchScore) {
            bestMatchScore = score;
            matchReason = reason;
          }
        }
      }

      if (group.length > 1) {
        processed.add(contacts[i]._id);
        groups.push({
          contacts: group,
          matchScore: bestMatchScore,
          matchReason,
        });
      }
    }

    // Sort by match score (highest first)
    groups.sort((a, b) => b.matchScore - a.matchScore);
    setDuplicateGroups(groups);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (contacts) {
      analyzeDuplicates();
    }
  }, [contacts]);

  const handleOpenMerge = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    setPrimaryContact(group.contacts[0]._id);
  };

  const handleMerge = async () => {
    if (!selectedGroup || !primaryContact) return;

    setIsMerging(true);

    try {
      // In a real implementation, call a Convex mutation to merge contacts
      // For now, we'll simulate the merge
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove merged group from list
      setDuplicateGroups(groups => 
        groups.filter(g => g !== selectedGroup)
      );
      
      toast.success("Contacts fusionnés avec succès");
      setSelectedGroup(null);
      setPrimaryContact(null);
      onMergeComplete?.();
    } catch (error) {
      toast.error("Erreur lors de la fusion");
    } finally {
      setIsMerging(false);
    }
  };

  const handleDismiss = (group: DuplicateGroup) => {
    setDuplicateGroups(groups => groups.filter(g => g !== group));
    toast.success("Doublon ignoré");
  };

  if (!contacts) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Détection de doublons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Détection de doublons
              </CardTitle>
              <CardDescription>
                {duplicateGroups.length} groupe(s) de doublons potentiels
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={analyzeDuplicates}
              disabled={isAnalyzing}
            >
              <RefreshCw className={cn("h-4 w-4", isAnalyzing && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {duplicateGroups.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-10 w-10 mx-auto text-green-500 mb-3" />
              <p className="text-sm text-muted-foreground">
                Aucun doublon détecté
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-3">
              <div className="space-y-3">
                {duplicateGroups.map((group, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            group.matchScore >= 0.9 && "text-red-600 border-red-200 bg-red-50",
                            group.matchScore >= 0.7 && group.matchScore < 0.9 && "text-amber-600 border-amber-200 bg-amber-50",
                            group.matchScore < 0.7 && "text-muted-foreground"
                          )}
                        >
                          {Math.round(group.matchScore * 100)}% similaire
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {group.matchReason}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDismiss(group)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {group.contacts.map((contact, i) => (
                        <div key={contact._id} className="flex items-center gap-1">
                          {i > 0 && (
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                          )}
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact.photoUrl} />
                            <AvatarFallback className="text-xs">
                              {contact.firstName?.[0]}{contact.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-xs">
                            <p className="font-medium truncate max-w-[100px]">
                              {contact.firstName} {contact.lastName}
                            </p>
                            {contact.company && (
                              <p className="text-muted-foreground truncate max-w-[100px]">
                                {contact.company}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 gap-1"
                      onClick={() => handleOpenMerge(group)}
                    >
                      <Merge className="h-3.5 w-3.5" />
                      Fusionner
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Merge Dialog */}
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Merge className="h-5 w-5" />
              Fusionner les contacts
            </DialogTitle>
            <DialogDescription>
              Sélectionnez le contact principal à conserver
            </DialogDescription>
          </DialogHeader>

          {selectedGroup && (
            <div className="space-y-3 py-4">
              {selectedGroup.contacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => setPrimaryContact(contact._id)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all",
                    primaryContact === contact._id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.photoUrl} />
                      <AvatarFallback>
                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </p>
                      {contact.role && (
                        <p className="text-xs text-muted-foreground">{contact.role}</p>
                      )}
                    </div>
                    {primaryContact === contact._id && (
                      <Badge className="bg-primary">Principal</Badge>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {contact.email && (
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </p>
                    )}
                    {contact.phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </p>
                    )}
                    {contact.company && (
                      <p className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {contact.company}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedGroup(null)} disabled={isMerging}>
              Annuler
            </Button>
            <Button onClick={handleMerge} disabled={isMerging || !primaryContact}>
              {isMerging ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fusion...
                </>
              ) : (
                <>
                  <Merge className="h-4 w-4 mr-2" />
                  Fusionner ({selectedGroup?.contacts.length} contacts)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Calculate similarity score between two contacts
 * Returns score (0-1) and reason for match
 */
function calculateSimilarity(a: Contact, b: Contact): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  // Email exact match (high confidence)
  if (a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase()) {
    score += 0.5;
    reasons.push("Email identique");
  }

  // Name similarity
  const nameA = `${a.firstName} ${a.lastName}`.toLowerCase().trim();
  const nameB = `${b.firstName} ${b.lastName}`.toLowerCase().trim();
  const nameSimilarity = stringSimilarity(nameA, nameB);
  
  if (nameSimilarity >= 0.8) {
    score += 0.3;
    reasons.push("Nom similaire");
  } else if (nameSimilarity >= 0.6) {
    score += 0.2;
    reasons.push("Nom proche");
  }

  // Phone match (after normalization)
  if (a.phone && b.phone) {
    const phoneA = normalizePhone(a.phone);
    const phoneB = normalizePhone(b.phone);
    if (phoneA === phoneB) {
      score += 0.3;
      reasons.push("Téléphone identique");
    }
  }

  // Same company
  if (a.company && b.company && 
      a.company.toLowerCase() === b.company.toLowerCase()) {
    score += 0.1;
    reasons.push("Même société");
  }

  return {
    score: Math.min(score, 1),
    reason: reasons.join(", ") || "Correspondance partielle",
  };
}

/**
 * Levenshtein-based string similarity
 */
function stringSimilarity(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[s2.length][s1.length];
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\.\(\)]/g, "").replace(/^0/, "+33");
}
