"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff,
  FileAudio,
  Sparkles, 
  Copy, 
  Check, 
  Loader2,
  Upload,
  Play,
  Pause,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface MeetingTranscriptionProps {
  dealId?: string;
  className?: string;
  onTranscriptionComplete?: (result: TranscriptionResult) => void;
}

interface TranscriptionResult {
  transcript: string;
  summary: string;
  actionItems: string[];
  participants: string[];
  duration: string;
}

export function MeetingTranscription({
  dealId,
  className = "",
  onTranscriptionComplete,
}: MeetingTranscriptionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    toast.info("Enregistrement démarré");
    // In full implementation, use MediaRecorder API
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.success("Enregistrement terminé");
    // Process the recording
    processAudio();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      toast.success(`Fichier sélectionné: ${file.name}`);
    }
  };

  const processAudio = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 200));
        setProgress(i);
      }

      // In full implementation, send to Whisper API
      // const formData = new FormData();
      // formData.append("audio", audioFile);
      // const response = await fetch("/api/ai/transcribe", {
      //   method: "POST",
      //   body: formData,
      // });

      // Mock result for demo
      const mockResult: TranscriptionResult = {
        transcript: `Réunion du ${new Date().toLocaleDateString("fr-FR")}

Jean: Bonjour à tous, merci d'être présents. Aujourd'hui nous allons discuter de l'avancement du dossier TechCorp.

Marie: Oui, j'ai eu un call avec leur CFO hier. Les chiffres sont encourageants, le CA est en croissance de 15% sur l'année.

Pierre: Excellent. Quelle est la position du management concernant la valorisation ?

Jean: Ils ont des attentes élevées, autour de 8x EBITDA. Nous devons travailler sur une contre-proposition.

Marie: Je suggère de préparer une analyse de comps et de revenir vers eux la semaine prochaine.

Jean: D'accord, Marie tu te charges de ça. Pierre, peux-tu avancer sur la due diligence juridique ?

Pierre: Oui, je contacte les avocats cet après-midi.

Jean: Parfait. Prochaine réunion vendredi pour faire le point.`,
        summary: "Réunion d'avancement sur le dossier TechCorp. Le CFO de la cible a confirmé une croissance de 15% du CA. Les attentes de valorisation sont à 8x EBITDA. L'équipe doit préparer une analyse de comparables et avancer sur la due diligence juridique.",
        actionItems: [
          "Marie: Préparer analyse de comps pour la semaine prochaine",
          "Pierre: Contacter les avocats pour la DD juridique",
          "Jean: Organiser point d'équipe vendredi",
        ],
        participants: ["Jean", "Marie", "Pierre"],
        duration: "12:34",
      };

      setResult(mockResult);
      onTranscriptionComplete?.(mockResult);
      toast.success("Transcription terminée");

    } catch (error) {
      toast.error("Erreur lors de la transcription");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    const text = `📝 Transcription de réunion

${result.transcript}

---
📋 Résumé: ${result.summary}

✅ Actions:
${result.actionItems.map((a) => `• ${a}`).join("\n")}

👥 Participants: ${result.participants.join(", ")}
⏱ Durée: ${result.duration}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Transcription copiée");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileAudio className="h-4 w-4 text-purple-500" />
          Transcription de Réunion
        </CardTitle>
        <CardDescription>
          Enregistrez ou importez un audio pour générer une transcription
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!result && !isProcessing && (
          <>
            {/* Recording controls */}
            <div className="flex flex-col items-center gap-4 py-6">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className="w-20 h-20 rounded-full"
                onClick={handleRecordToggle}
              >
                {isRecording ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Enregistrement en cours..." : "Cliquez pour enregistrer"}
              </p>
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <Clock className="h-3 w-3 mr-1" />
                  REC
                </Badge>
              )}
            </div>

            {/* Or upload */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou importez un fichier
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Importer un audio
              </Button>
              {audioFile && (
                <Button onClick={processAudio} className="gap-2">
                  <Play className="h-4 w-4" />
                  Transcrire
                </Button>
              )}
            </div>

            {audioFile && (
              <Badge variant="outline" className="w-full justify-center">
                {audioFile.name}
              </Badge>
            )}
          </>
        )}

        {/* Processing */}
        {isProcessing && (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Transcription en cours... {progress}%
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{result.duration}</Badge>
                <Badge variant="outline">{result.participants.length} participants</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="gap-1"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                Copier
              </Button>
            </div>

            {/* Summary */}
            <div className="p-3 bg-primary/5 rounded-lg border">
              <h4 className="text-xs font-semibold flex items-center gap-1 mb-2">
                <Sparkles className="h-3 w-3" />
                Résumé IA
              </h4>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>

            {/* Action Items */}
            <div className="p-3 border rounded-lg">
              <h4 className="text-xs font-semibold mb-2">Actions identifiées</h4>
              <ul className="space-y-1">
                {result.actionItems.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Transcript */}
            <div className="space-y-2">
              <Label>Transcription complète</Label>
              <Textarea
                value={result.transcript}
                readOnly
                rows={8}
                className="text-xs font-mono"
              />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setResult(null)}
            >
              Nouvelle transcription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
