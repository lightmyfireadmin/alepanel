"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, 
  Send, 
  Inbox, 
  RefreshCw,
  ExternalLink,
  Calendar,
  Paperclip,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface EmailMessage {
  id: string;
  subject: string;
  bodyPreview?: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  sentDateTime: string;
  hasAttachments: boolean;
  webLink: string;
  isRead: boolean;
  direction: "sent" | "received";
}

interface ContactEmailHistoryProps {
  contactEmail: string;
  contactName?: string;
  className?: string;
  maxEmails?: number;
  onEmailClick?: (email: EmailMessage) => void;
}

/**
 * Contact Email History
 * Shows emails sent to/received from a specific contact via Microsoft Graph API
 */
export function ContactEmailHistory({
  contactEmail,
  contactName,
  className,
  maxEmails = 20,
  onEmailClick,
}: ContactEmailHistoryProps) {
  const { session } = useSession();
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMicrosoftToken = useCallback(async (): Promise<string | null> => {
    if (!session) return null;
    try {
      const token = await session.getToken({ template: "microsoft" });
      return token;
    } catch {
      return null;
    }
  }, [session]);

  const fetchEmails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getMicrosoftToken();
      
      if (!token) {
        setError("Connexion Microsoft requise");
        setEmails(generateMockEmails(contactEmail, contactName));
        setIsLoading(false);
        return;
      }

      // Search for emails involving this contact
      const searchQuery = encodeURIComponent(contactEmail);
      
      // Fetch sent emails
      const sentResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/mailFolders/sentitems/messages?$filter=contains(toRecipients/emailAddress/address,'${searchQuery}')&$top=${maxEmails}&$orderby=sentDateTime desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch received emails  
      const receivedResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=contains(from/emailAddress/address,'${searchQuery}')&$top=${maxEmails}&$orderby=receivedDateTime desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sentData = sentResponse.ok ? await sentResponse.json() : { value: [] };
      const receivedData = receivedResponse.ok ? await receivedResponse.json() : { value: [] };

      const allEmails: EmailMessage[] = [
        ...(sentData.value || []).map((m: any) => mapEmail(m, "sent")),
        ...(receivedData.value || []).map((m: any) => mapEmail(m, "received")),
      ];

      // Sort by date
      allEmails.sort((a, b) => 
        new Date(b.sentDateTime).getTime() - new Date(a.sentDateTime).getTime()
      );

      setEmails(allEmails.slice(0, maxEmails));
    } catch (err) {
      console.error("Error fetching emails:", err);
      setError("Erreur de chargement");
      setEmails(generateMockEmails(contactEmail, contactName));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contactEmail) {
      fetchEmails();
    }
  }, [contactEmail]);

  const mapEmail = (m: any, direction: "sent" | "received"): EmailMessage => ({
    id: m.id,
    subject: m.subject || "(Sans objet)",
    bodyPreview: m.bodyPreview,
    from: {
      name: m.from?.emailAddress?.name || "",
      email: m.from?.emailAddress?.address || "",
    },
    to: (m.toRecipients || []).map((r: any) => ({
      name: r.emailAddress?.name || "",
      email: r.emailAddress?.address || "",
    })),
    sentDateTime: m.sentDateTime || m.receivedDateTime,
    hasAttachments: m.hasAttachments,
    webLink: m.webLink,
    isRead: m.isRead,
    direction,
  });

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Historique Emails
            </CardTitle>
            <CardDescription>
              {contactName || contactEmail}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={fetchEmails}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error && emails.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun email échangé avec ce contact
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-3">
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => onEmailClick?.(email)}
                  className={cn(
                    "flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group",
                    !email.isRead && email.direction === "received" && "bg-primary/5"
                  )}
                >
                  {/* Direction indicator */}
                  <div className="flex-shrink-0 pt-1">
                    {email.direction === "sent" ? (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Send className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Inbox className="h-3.5 w-3.5 text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={cn(
                          "text-sm truncate",
                          !email.isRead && email.direction === "received" ? "font-semibold" : "font-medium"
                        )}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {email.direction === "sent" 
                            ? `À: ${email.to[0]?.email}` 
                            : `De: ${email.from.name || email.from.email}`
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {email.hasAttachments && (
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                        )}
                        <ExternalLink 
                          className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(email.webLink, "_blank");
                          }}
                        />
                      </div>
                    </div>

                    {email.bodyPreview && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {email.bodyPreview}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDistanceToNow(new Date(email.sentDateTime), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-4",
                          email.direction === "sent" 
                            ? "text-blue-600 border-blue-200" 
                            : "text-green-600 border-green-200"
                        )}
                      >
                        {email.direction === "sent" ? "Envoyé" : "Reçu"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// Mock emails for demo
function generateMockEmails(email: string, name?: string): EmailMessage[] {
  const now = new Date();
  const displayName = name || email.split("@")[0];

  return [
    {
      id: "1",
      subject: "Re: Point sur le dossier",
      bodyPreview: "Bonjour, suite à notre dernier échange, je vous confirme que les documents ont été transmis...",
      from: { name: displayName, email },
      to: [{ name: "Moi", email: "me@example.com" }],
      sentDateTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      hasAttachments: false,
      webLink: "#",
      isRead: false,
      direction: "received",
    },
    {
      id: "2",
      subject: "Documents Due Diligence",
      bodyPreview: "Veuillez trouver ci-joint les documents demandés pour la phase de DD...",
      from: { name: "Moi", email: "me@example.com" },
      to: [{ name: displayName, email }],
      sentDateTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      hasAttachments: true,
      webLink: "#",
      isRead: true,
      direction: "sent",
    },
    {
      id: "3",
      subject: "Invitation réunion Q3",
      bodyPreview: "Je vous invite à participer à notre prochaine réunion de suivi...",
      from: { name: displayName, email },
      to: [{ name: "Moi", email: "me@example.com" }],
      sentDateTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      hasAttachments: false,
      webLink: "#",
      isRead: true,
      direction: "received",
    },
  ];
}
