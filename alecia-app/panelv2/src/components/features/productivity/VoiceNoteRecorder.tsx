"use client";

import { useState, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Loader2, Play, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function VoiceNoteRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const generateUploadUrl = useMutation(api.voice.generateUploadUrl);
  const saveVoiceNote = useMutation(api.voice.saveVoiceNote);
  const transcribe = useAction(api.voice.transcribeAction);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Microphone inaccessible.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleUpload = async () => {
    if (audioChunks.current.length === 0) return;
    
    setIsLoading(true);
    try {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();
      
      // 2. Post the blob
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "audio/webm" },
        body: audioBlob,
      });
      
      const { storageId } = await result.json();
      
      // 3. Save to DB
      await saveVoiceNote({ storageId, duration: 0 }); // Duration placeholder
      
      toast.success("Enregistrement sauvegardé !");
      
      // 4. Transcribe
      toast.info("Transcription en cours...");
      const text = await transcribe({ storageId });
      setTranscription(text);
      toast.success("Transcription terminée.");

    } catch (err) {
      console.error(err);
      toast.error("Échec de l'envoi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-none border bg-white dark:bg-zinc-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mic className="w-4 h-4 text-red-500" />
            Note Vocale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center py-6">
            {!audioUrl ? (
                <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="h-16 w-16 rounded-full"
                    onClick={isRecording ? stopRecording : startRecording}
                >
                    {isRecording ? <Square className="fill-current" /> : <Mic className="h-8 w-8" />}
                </Button>
            ) : (
                <div className="flex items-center gap-4">
                    <audio src={audioUrl} controls className="h-10" />
                    <Button variant="ghost" size="icon" onClick={() => setAudioUrl(null)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>
            )}
        </div>

        {audioUrl && !transcription && (
            <Button onClick={handleUpload} disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Transcrire et Sauvegarder
            </Button>
        )}

        {transcription && (
            <div className="p-4 bg-muted rounded-lg border text-sm italic text-muted-foreground leading-relaxed">
                "{transcription}"
            </div>
        )}
      </CardContent>
    </Card>
  );
}
