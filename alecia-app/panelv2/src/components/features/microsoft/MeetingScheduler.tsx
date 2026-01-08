"use client";

import { useState } from "react";
import { useMicrosoftCalendar, CreateMeetingParams } from "@/hooks/use-microsoft-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, Video, Users, Loader2, Plus, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, addHours } from "date-fns";

interface MeetingSchedulerProps {
  /** Trigger element */
  trigger?: React.ReactNode;
  /** Pre-filled subject (e.g., deal name) */
  subject?: string;
  /** Pre-filled attendees */
  attendees?: { email: string; name?: string }[];
  /** Deal ID for linking */
  dealId?: string;
  /** Callback on success */
  onScheduled?: (meeting: { id: string; url?: string }) => void;
}

export function MeetingScheduler({
  trigger,
  subject = "",
  attendees: initialAttendees = [],
  dealId,
  onScheduled,
}: MeetingSchedulerProps) {
  const { createMeeting, loading } = useMicrosoftCalendar();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  
  // Form state
  const [formSubject, setFormSubject] = useState(subject);
  const [formDate, setFormDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formTime, setFormTime] = useState(format(addHours(new Date(), 1), "HH:00"));
  const [formDuration, setFormDuration] = useState("60");
  const [formAttendees, setFormAttendees] = useState<{ email: string; name?: string }[]>(initialAttendees);
  const [newAttendee, setNewAttendee] = useState("");
  const [formBody, setFormBody] = useState("");
  const [isTeamsMeeting, setIsTeamsMeeting] = useState(true);

  const resetForm = () => {
    setFormSubject(subject);
    setFormDate(format(new Date(), "yyyy-MM-dd"));
    setFormTime(format(addHours(new Date(), 1), "HH:00"));
    setFormDuration("60");
    setFormAttendees(initialAttendees);
    setNewAttendee("");
    setFormBody("");
    setIsTeamsMeeting(true);
    setIsSuccess(false);
    setMeetingUrl(null);
  };

  const addAttendee = () => {
    const email = newAttendee.trim();
    if (email && email.includes("@")) {
      setFormAttendees([...formAttendees, { email }]);
      setNewAttendee("");
    }
  };

  const removeAttendee = (index: number) => {
    setFormAttendees(formAttendees.filter((_, i) => i !== index));
  };

  const handleSchedule = async () => {
    if (!formSubject.trim()) {
      toast.error("Veuillez entrer un sujet");
      return;
    }

    const startDateTime = new Date(`${formDate}T${formTime}`);
    const endDateTime = new Date(startDateTime.getTime() + parseInt(formDuration) * 60 * 1000);

    const params: CreateMeetingParams = {
      subject: formSubject,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      attendees: formAttendees,
      body: formBody || undefined,
      isOnlineMeeting: isTeamsMeeting,
      dealId,
    };

    const result = await createMeeting(params);

    if (result) {
      setIsSuccess(true);
      setMeetingUrl(result.onlineMeetingUrl || null);
      toast.success("Réunion planifiée avec succès");
      onScheduled?.({ id: result.id, url: result.onlineMeetingUrl });
    }
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(resetForm, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Planifier une réunion
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nouvelle réunion
          </DialogTitle>
          <DialogDescription>
            Planifier une réunion Teams avec les parties prenantes
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Réunion planifiée !</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Les invitations ont été envoyées aux participants
              </p>
            </div>
            {meetingUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(meetingUrl, "_blank")}
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                Ouvrir dans Teams
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                placeholder="Ex: Point d'avancement - Dossier Acquisition"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <Input
                  id="time"
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Durée</Label>
              <select
                id="duration"
                className="w-full h-9 px-3 border rounded-md text-sm bg-background"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
              </select>
            </div>

            {/* Teams Meeting Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Réunion Teams</span>
              </div>
              <Switch
                checked={isTeamsMeeting}
                onCheckedChange={setIsTeamsMeeting}
              />
            </div>

            {/* Attendees */}
            <div className="space-y-2">
              <Label>Participants</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="email@example.com"
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttendee())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addAttendee}
                  disabled={!newAttendee.includes("@")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formAttendees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formAttendees.map((attendee, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs"
                    >
                      <Users className="h-3 w-3" />
                      {attendee.name || attendee.email}
                      <button
                        type="button"
                        onClick={() => removeAttendee(i)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="body">Description (optionnel)</Label>
              <Textarea
                id="body"
                placeholder="Ordre du jour..."
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {isSuccess ? (
            <Button onClick={() => handleClose(false)}>Fermer</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleClose(false)} disabled={loading}>
                Annuler
              </Button>
              <Button onClick={handleSchedule} disabled={loading || !formSubject.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Planifier
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
