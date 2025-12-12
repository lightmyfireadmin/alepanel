"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Square, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * VoiceNoteRecorder - Floating Action Button (FAB)
 * 
 * UI Skeleton for voice recording feature.
 * Future integration: OpenAI Whisper for transcription.
 */
export function VoiceNoteRecorder() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const startRecording = () => {
    setIsRecording(true);
    // Mock timer - in real app, use actual audio recording
    const interval = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
    
    // Store interval ID for cleanup
    (window as unknown as { recordingInterval?: NodeJS.Timeout }).recordingInterval = interval;
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    
    const interval = (window as unknown as { recordingInterval?: NodeJS.Timeout }).recordingInterval;
    if (interval) clearInterval(interval);
    
    // In real app: send audio to Whisper API for transcription
    console.log("Recording stopped - would send to Whisper API");
  };

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
            onClick={() => !isRecording && setIsOpen(false)}
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
                  onClick={() => !isRecording && setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-[var(--background-tertiary)] text-[var(--foreground-muted)]"
                  disabled={isRecording}
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
                      isRecording
                        ? "bg-red-500"
                        : "bg-[var(--accent)]"
                    }`}
                    animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Mic className="w-8 h-8 text-white" />
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
                  {isRecording 
                    ? "Enregistrement en cours..." 
                    : "Appuyez pour enregistrer"}
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                {!isRecording ? (
                  <Button
                    className="flex-1 btn-gold gap-2"
                    onClick={startRecording}
                  >
                    <Mic className="w-4 h-4" />
                    Commencer
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                      onClick={stopRecording}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                      onClick={() => {
                        stopRecording();
                        setIsOpen(false);
                      }}
                    >
                      <Check className="w-4 h-4" />
                      Sauvegarder
                    </Button>
                  </>
                )}
              </div>

              {/* Info */}
              <p className="mt-4 text-xs text-center text-[var(--foreground-muted)]">
                Transcription automatique via IA (bientôt disponible)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
