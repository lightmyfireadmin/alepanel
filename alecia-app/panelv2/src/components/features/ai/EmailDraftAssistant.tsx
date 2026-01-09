"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2,
  RefreshCw 
} from "lucide-react";
import { toast } from "sonner";

interface EmailDraftProps {
  defaultRecipient?: string;
  defaultSubject?: string;
  dealContext?: string;
  className?: string;
  onDraftGenerated?: (draft: EmailDraft) => void;
}

interface EmailDraft {
  subject: string;
  body: string;
  tone: string;
}

const EMAIL_TONES = [
  { value: "formal", label: "Formel" },
  { value: "professional", label: "Professionnel" },
  { value: "friendly", label: "Cordial" },
  { value: "urgent", label: "Urgent" },
];

const EMAIL_TYPES = [
  { value: "intro", label: "Prise de contact" },
  { value: "followup", label: "Relance" },
  { value: "nda_request", label: "Envoi NDA" },
  { value: "information_request", label: "Demande d'informations" },
  { value: "meeting_request", label: "Demande de RDV" },
  { value: "thank_you", label: "Remerciement" },
];

export function EmailDraftAssistant({
  defaultRecipient = "",
  defaultSubject = "",
  dealContext = "",
  className = "",
  onDraftGenerated,
}: EmailDraftProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [config, setConfig] = useState({
    recipient: defaultRecipient,
    emailType: "intro",
    tone: "professional",
    customInstructions: "",
  });

  const [draft, setDraft] = useState<EmailDraft | null>(null);

  const generateDraft = async () => {
    if (!config.recipient) {
      toast.error("Veuillez indiquer le destinataire");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/email-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: config.recipient,
          emailType: config.emailType,
          tone: config.tone,
          customInstructions: config.customInstructions,
          dealContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération");
      }

      const result = await response.json();
      setDraft(result);
      onDraftGenerated?.(result);
    } catch (error) {
      // Fallback mock for demo
      const mockDraft = generateMockDraft(config);
      setDraft(mockDraft);
      onDraftGenerated?.(mockDraft);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!draft) return;
    
    const text = `Objet: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Email copié");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-500" />
          Assistant Email IA
        </CardTitle>
        <CardDescription>
          Générez des emails professionnels adaptés au contexte
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="recipient">Destinataire</Label>
            <Input
              id="recipient"
              value={config.recipient}
              onChange={(e) => setConfig({ ...config, recipient: e.target.value })}
              placeholder="Jean Dupont (PDG TechCorp)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailType">Type d'email</Label>
            <Select
              value={config.emailType}
              onValueChange={(value) => setConfig({ ...config, emailType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type d'email" />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Ton</Label>
          <Select
            value={config.tone}
            onValueChange={(value) => setConfig({ ...config, tone: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ton de l'email" />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_TONES.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions personnalisées (optionnel)</Label>
          <Textarea
            id="instructions"
            value={config.customInstructions}
            onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
            placeholder="Ex: Mentionner notre rencontre au salon XYZ..."
            rows={2}
          />
        </div>

        <Button onClick={generateDraft} disabled={isLoading} className="w-full gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Générer l'email
        </Button>

        {/* Generated Draft */}
        {draft && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Email généré</h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-1"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  Copier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateDraft}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Régénérer
                </Button>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
              <div className="text-sm">
                <span className="text-muted-foreground">Objet: </span>
                <span className="font-medium">{draft.subject}</span>
              </div>
              <div className="text-sm whitespace-pre-wrap">
                {draft.body}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock draft generator for demo
function generateMockDraft(config: { recipient: string; emailType: string; tone: string }): EmailDraft {
  const { recipient, emailType, tone } = config;
  const name = recipient.split(" ")[0] || "Madame, Monsieur";

  const subjects: Record<string, string> = {
    intro: "Prise de contact - Opportunité stratégique",
    followup: "Suite à notre échange",
    nda_request: "Accord de confidentialité - Opportunité M&A",
    information_request: "Demande d'informations complémentaires",
    meeting_request: "Proposition de rendez-vous",
    thank_you: "Remerciements suite à notre échange",
  };

  const openings: Record<string, string> = {
    formal: `Cher ${name},\n\nNous avons l'honneur de vous contacter`,
    professional: `Bonjour ${name},\n\nNous nous permettons de vous contacter`,
    friendly: `Bonjour ${name},\n\nJ'espère que vous allez bien. Je me permets de vous contacter`,
    urgent: `Bonjour ${name},\n\nNous vous contactons dans le cadre d'une opportunité urgente`,
  };

  const bodies: Record<string, string> = {
    intro: `${openings[tone] || openings.professional} dans le cadre d'une opportunité stratégique qui pourrait vous intéresser.

Notre cabinet, spécialisé en fusions-acquisitions, accompagne actuellement un acquéreur à la recherche d'opportunités de croissance externe dans votre secteur d'activité.

Votre entreprise a retenu notre attention par son positionnement et son historique de croissance. Nous souhaiterions échanger avec vous pour explorer les possibilités de collaboration.

Seriez-vous disponible pour un échange téléphonique de 15-20 minutes dans les prochains jours ?

Dans l'attente de votre retour, je reste à votre disposition.

Cordialement,`,
    followup: `${openings[tone] || openings.professional} pour faire suite à notre dernier échange.

Je souhaitais revenir vers vous concernant l'opportunité dont nous avions discuté. Avez-vous eu l'occasion de réfléchir à notre proposition ?

Je reste à votre disposition pour répondre à vos éventuelles questions ou organiser une nouvelle rencontre si vous le souhaitez.

Dans l'attente de votre retour.

Cordialement,`,
    nda_request: `${openings[tone] || openings.professional} suite aux discussions préliminaires que nous avons eues.

Afin de poursuivre nos échanges et de vous communiquer des informations plus détaillées sur l'opportunité, nous vous prions de bien vouloir trouver ci-joint un accord de confidentialité (NDA).

Nous vous serions reconnaissants de bien vouloir le signer et nous le retourner afin que nous puissions avancer dans ce dossier.

Restant à votre disposition pour toute question.

Cordialement,`,
    information_request: `${openings[tone] || openings.professional} afin de solliciter quelques informations complémentaires.

Dans le cadre de notre analyse, nous aurions besoin des éléments suivants :
- États financiers des 3 derniers exercices
- Business plan / projections
- Organigramme de la société

Ces informations nous permettront d'affiner notre analyse et de vous faire un retour circonstancié.

Merci par avance pour votre retour.

Cordialement,`,
    meeting_request: `${openings[tone] || openings.professional} pour vous proposer un rendez-vous.

Seriez-vous disponible pour un échange, en présentiel ou en visioconférence, la semaine prochaine ?

Je vous propose les créneaux suivants :
- Mardi 10h-11h
- Mercredi 14h-15h
- Jeudi 16h-17h

N'hésitez pas à me proposer d'autres disponibilités si ces créneaux ne vous conviennent pas.

Cordialement,`,
    thank_you: `${openings[tone] || openings.professional} pour vous remercier de notre échange d'aujourd'hui.

Je tenais à vous réitérer notre intérêt pour cette opportunité et notre engagement à vous accompagner dans les meilleures conditions.

Les prochaines étapes ont été bien notées, et nous reviendrons vers vous comme convenu.

Encore merci pour votre temps et votre confiance.

Cordialement,`,
  };

  return {
    subject: subjects[emailType] || "Prise de contact",
    body: bodies[emailType] || bodies.intro,
    tone,
  };
}
