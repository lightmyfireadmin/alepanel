"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Square, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadVoiceNote } from "@/lib/actions/voice-notes";

interface VoiceNoteRecorderProps {
  projectId?: string;
  contactId?: string;
  onRecorded?: (voiceNoteId: string, blobUrl: string) => void;
}

/**
 * VoiceNoteRecorder - Floating Action Button (FAB)
 * 
 * Records audio and uploads to Vercel Blob storage.
 * Requirement: Voice notes must be stored in cloud storage,
 * NOT in local filesystem (Vercel is serverless/ephemeral).
 */
export function VoiceNoteRecorder({ projectId, contactId, onRecorded }: VoiceNoteRecorderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      // Create MediaRecorder with webm format (widely supported)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
      
    } catch (err) {
      console.error("[VoiceRecorder] Error accessing microphone:", err);
      setError("Impossible d'accéder au microphone");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    setIsRecording(false);
  }, []);

  const cancelRecording = useCallback(() => {
    stopRecording();
    setRecordingTime(0);
    audioChunksRef.current = [];
    setError(null);
  }, [stopRecording]);

  const saveRecording = useCallback(async () => {
    stopRecording();
    
    // Wait a moment for final data to be collected
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    if (audioChunksRef.current.length === 0) {
      setError("Aucun enregistrement à sauvegarder");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Create blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
      // Create FormData for server action
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("duration", recordingTime.toString());
      
      if (projectId) {
        formData.append("projectId", projectId);
      }
      if (contactId) {
        formData.append("contactId", contactId);
      }
      
      // Upload to Vercel Blob via server action
      const result = await uploadVoiceNote(formData);
      
      if (result.success && result.voiceNoteId && result.blobUrl) {
        console.log("[VoiceRecorder] Uploaded successfully:", result.blobUrl);
        onRecorded?.(result.voiceNoteId, result.blobUrl);
        setIsOpen(false);
        setRecordingTime(0);
        audioChunksRef.current = [];
      } else {
        setError(result.error || "Échec du téléversement");
      }
      
    } catch (err) {
      console.error("[VoiceRecorder] Upload error:", err);
      setError("Erreur lors du téléversement");
    } finally {
      setIsUploading(false);
    }
  }, [stopRecording, recordingTime, projectId, contactId, onRecorded]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* FAB Button - Only visible on mobile */}
      <motion.button
        className="fixed bottom-6 right-6 md:hidden z-50 w-14 h-14 rounded-full bg-[var(--accent)] text-black shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Enregistrer une note vocale"
      >
        <Mic className="w-6 h-6" />
      </motion.button>

      {/* Recording Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center md:items-center p-4"
            onClick={() => !isRecording && !isUploading && setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm bg-[var(--card)] rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Note vocale
                </h3>
                <button
                  onClick={() => !isRecording && !isUploading && setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-[var(--background-tertiary)] text-[var(--foreground-muted)]"
                  disabled={isRecording || isUploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recording Visualizer */}
              <div className="flex flex-col items-center py-8">
                {/* Mic Icon with pulse animation */}
                <div className="relative">
                  <motion.div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      isUploading
                        ? "bg-blue-500"
                        : isRecording
                          ? "bg-red-500"
                          : "bg-[var(--accent)]"
                    }`}
                    animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </motion.div>
                  
                  {/* Pulse rings when recording */}
                  {isRecording && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-red-500"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-red-500"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.5 }}
                      />
                    </>
                  )}
                </div>

                {/* Timer */}
                <p className="mt-4 text-2xl font-mono text-[var(--foreground)]">
                  {formatTime(recordingTime)}
                </p>
                
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                  {isUploading
                    ? "Téléversement en cours..."
                    : isRecording
                      ? "Enregistrement en cours..."
                      : "Appuyez pour enregistrer"}
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                {!isRecording && !isUploading ? (
                  <Button
                    className="flex-1 btn-gold gap-2"
                    onClick={startRecording}
                  >
                    <Mic className="w-4 h-4" />
                    Commencer
                  </Button>
                ) : isUploading ? (
                  <Button
                    className="flex-1"
                    disabled
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi...
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                      onClick={cancelRecording}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                      onClick={saveRecording}
                    >
                      <Check className="w-4 h-4" />
                      Sauvegarder
                    </Button>
                  </>
                )}
              </div>

              {/* Info */}
              <p className="mt-4 text-xs text-center text-[var(--foreground-muted)]">
                Stockage cloud sécurisé (Vercel Blob)
                <br />
                <span className="text-[var(--accent)]">
                  Transcription IA bientôt disponible
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
