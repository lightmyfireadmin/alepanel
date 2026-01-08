"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Network, 
  User, 
  Building2, 
  Link2,
  ArrowLeftRight,
  Eye,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactNode {
  id: string;
  firstName: string;
  lastName: string;
  role?: string;
  company?: string;
  photoUrl?: string;
}

interface Relationship {
  sourceId: string;
  targetId: string;
  type: "colleague" | "knows" | "introduced_by" | "reports_to" | "previously_worked";
  strength: 1 | 2 | 3; // 1 = weak, 2 = medium, 3 = strong
  notes?: string;
}

interface RelationshipGraphProps {
  contacts: ContactNode[];
  relationships: Relationship[];
  className?: string;
  onContactClick?: (contact: ContactNode) => void;
  onRelationshipClick?: (relationship: Relationship) => void;
}

const relationshipLabels: Record<string, string> = {
  colleague: "Collègue",
  knows: "Connaît",
  introduced_by: "Présenté par",
  reports_to: "Rapporte à",
  previously_worked: "Ex-collègue",
};

const relationshipColors: Record<string, string> = {
  colleague: "border-blue-400",
  knows: "border-gray-400",
  introduced_by: "border-green-400",
  reports_to: "border-purple-400",
  previously_worked: "border-amber-400",
};

/**
 * Contact Relationship Graph
 * Visualizes connections between contacts
 */
export function RelationshipGraph({
  contacts,
  relationships,
  className,
  onContactClick,
  onRelationshipClick,
}: RelationshipGraphProps) {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [hoveredRelationship, setHoveredRelationship] = useState<string | null>(null);

  // Group contacts by company
  const groupedByCompany = useMemo(() => {
    const groups: Record<string, ContactNode[]> = {};
    contacts.forEach(contact => {
      const company = contact.company || "Sans société";
      if (!groups[company]) groups[company] = [];
      groups[company].push(contact);
    });
    return groups;
  }, [contacts]);

  // Get relationships for a contact
  const getContactRelationships = (contactId: string) => {
    return relationships.filter(
      r => r.sourceId === contactId || r.targetId === contactId
    );
  };

  // Get connected contacts for a contact
  const getConnectedContacts = (contactId: string) => {
    const rels = getContactRelationships(contactId);
    const connectedIds = new Set(
      rels.flatMap(r => [r.sourceId, r.targetId]).filter(id => id !== contactId)
    );
    return contacts.filter(c => connectedIds.has(c.id));
  };

  const handleContactClick = (contact: ContactNode) => {
    setSelectedContact(selectedContact === contact.id ? null : contact.id);
    onContactClick?.(contact);
  };

  const selectedContactData = contacts.find(c => c.id === selectedContact);
  const selectedRelationships = selectedContact ? getContactRelationships(selectedContact) : [];
  const connectedContacts = selectedContact ? getConnectedContacts(selectedContact) : [];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Network className="h-4 w-4" />
              Réseau de Relations
            </CardTitle>
            <CardDescription>
              {contacts.length} contacts • {relationships.length} connexions
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <Network className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun contact à afficher
            </p>
          </div>
        ) : (
          <div className="flex gap-4">
            {/* Company Groups */}
            <ScrollArea className="flex-1 h-[400px]">
              <div className="space-y-4">
                {Object.entries(groupedByCompany).map(([company, companyContacts]) => (
                  <div key={company} className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 sticky top-0 bg-background py-1">
                      <Building2 className="h-3 w-3" />
                      {company}
                      <Badge variant="outline" className="ml-auto text-[10px]">
                        {companyContacts.length}
                      </Badge>
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {companyContacts.map(contact => {
                        const rels = getContactRelationships(contact.id);
                        const isSelected = selectedContact === contact.id;
                        const isConnected = selectedContact && 
                          connectedContacts.some(c => c.id === contact.id);

                        return (
                          <TooltipProvider key={contact.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleContactClick(contact)}
                                  className={cn(
                                    "flex items-center gap-2 p-2 rounded-lg border text-left transition-all",
                                    isSelected && "border-primary bg-primary/5 shadow-sm",
                                    isConnected && !isSelected && "border-primary/50 bg-primary/5",
                                    !isSelected && !isConnected && "hover:bg-muted/50"
                                  )}
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={contact.photoUrl} />
                                    <AvatarFallback className="text-xs">
                                      {contact.firstName?.[0]}{contact.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {contact.firstName} {contact.lastName}
                                    </p>
                                    {contact.role && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        {contact.role}
                                      </p>
                                    )}
                                  </div>
                                  {rels.length > 0 && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5">
                                      <Link2 className="h-2.5 w-2.5 mr-0.5" />
                                      {rels.length}
                                    </Badge>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{contact.firstName} {contact.lastName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {rels.length} connexion{rels.length !== 1 ? "s" : ""}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Relationship Details Panel */}
            <div className="w-64 border-l pl-4">
              {selectedContactData ? (
                <div className="space-y-4">
                  {/* Selected Contact */}
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-12 w-12 mx-auto mb-2">
                      <AvatarImage src={selectedContactData.photoUrl} />
                      <AvatarFallback>
                        {selectedContactData.firstName?.[0]}{selectedContactData.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium">
                      {selectedContactData.firstName} {selectedContactData.lastName}
                    </p>
                    {selectedContactData.role && (
                      <p className="text-xs text-muted-foreground">{selectedContactData.role}</p>
                    )}
                    {selectedContactData.company && (
                      <p className="text-xs text-muted-foreground">{selectedContactData.company}</p>
                    )}
                  </div>

                  {/* Relationships */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground">
                      Connexions ({selectedRelationships.length})
                    </h4>
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {selectedRelationships.map(rel => {
                          const otherId = rel.sourceId === selectedContact ? rel.targetId : rel.sourceId;
                          const otherContact = contacts.find(c => c.id === otherId);
                          if (!otherContact) return null;

                          return (
                            <div
                              key={`${rel.sourceId}-${rel.targetId}`}
                              className={cn(
                                "p-2 rounded border-l-4 bg-muted/30",
                                relationshipColors[rel.type]
                              )}
                              onClick={() => onRelationshipClick?.(rel)}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-[10px]">
                                    {otherContact.firstName?.[0]}{otherContact.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">
                                    {otherContact.firstName} {otherContact.lastName}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {relationshipLabels[rel.type]}
                                  </p>
                                </div>
                                {/* Strength indicator */}
                                <div className="flex gap-0.5">
                                  {[1, 2, 3].map(i => (
                                    <span
                                      key={i}
                                      className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        i <= rel.strength ? "bg-primary" : "bg-muted"
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              {rel.notes && (
                                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                                  {rel.notes}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Eye className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cliquez sur un contact pour voir ses relations
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        {relationships.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t text-xs text-muted-foreground">
            {Object.entries(relationshipLabels).map(([type, label]) => (
              <span key={type} className="flex items-center gap-1">
                <span className={cn("w-3 h-0.5 rounded", relationshipColors[type]?.replace("border-", "bg-"))} />
                {label}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Example data
export const exampleRelationshipData = {
  contacts: [
    { id: "c1", firstName: "Jean", lastName: "Dupont", role: "CEO", company: "Target Corp" },
    { id: "c2", firstName: "Marie", lastName: "Martin", role: "CFO", company: "Target Corp" },
    { id: "c3", firstName: "Pierre", lastName: "Bernard", role: "Partner", company: "Cabinet M&A" },
    { id: "c4", firstName: "Sophie", lastName: "Leroy", role: "Analyst", company: "Cabinet M&A" },
    { id: "c5", firstName: "Marc", lastName: "Dubois", role: "CEO", company: "Acquéreur SA" },
  ],
  relationships: [
    { sourceId: "c1", targetId: "c2", type: "colleague" as const, strength: 3 as const },
    { sourceId: "c1", targetId: "c3", type: "knows" as const, strength: 2 as const, notes: "Rencontrés lors d'une conférence M&A" },
    { sourceId: "c3", targetId: "c4", type: "reports_to" as const, strength: 3 as const },
    { sourceId: "c3", targetId: "c5", type: "introduced_by" as const, strength: 2 as const },
    { sourceId: "c1", targetId: "c5", type: "knows" as const, strength: 1 as const },
  ],
};
