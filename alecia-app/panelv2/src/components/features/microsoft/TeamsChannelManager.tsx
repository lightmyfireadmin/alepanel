"use client";

import { useState, useEffect } from "react";
import { useMicrosoftCalendar, TeamsChannel } from "@/hooks/use-microsoft-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Hash, 
  Plus, 
  ExternalLink, 
  Lock, 
  Globe, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Users 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TeamsChannelManagerProps {
  className?: string;
  /** Pre-selected team ID */
  teamId?: string;
  /** Deal-specific prefix for channel names */
  dealPrefix?: string;
  /** Callback when channel is created */
  onChannelCreated?: (channel: TeamsChannel) => void;
}

export function TeamsChannelManager({
  className,
  teamId: initialTeamId,
  dealPrefix = "",
  onChannelCreated,
}: TeamsChannelManagerProps) {
  const { getTeams, getTeamChannels, createChannel, loading, error } = useMicrosoftCalendar();
  
  const [teams, setTeams] = useState<{ id: string; displayName: string; description?: string }[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeamId || "");
  const [channels, setChannels] = useState<TeamsChannel[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  
  // Create channel dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState(dealPrefix);
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [newChannelType, setNewChannelType] = useState<"standard" | "private">("standard");
  const [isCreating, setIsCreating] = useState(false);

  // Load teams on mount
  useEffect(() => {
    const loadTeams = async () => {
      setIsLoadingTeams(true);
      const data = await getTeams();
      setTeams(data);
      if (data.length > 0 && !selectedTeamId) {
        setSelectedTeamId(data[0].id);
      }
      setIsLoadingTeams(false);
    };
    loadTeams();
  }, []);

  // Load channels when team changes
  useEffect(() => {
    if (!selectedTeamId) return;
    
    const loadChannels = async () => {
      setIsLoadingChannels(true);
      const data = await getTeamChannels(selectedTeamId);
      setChannels(data);
      setIsLoadingChannels(false);
    };
    loadChannels();
  }, [selectedTeamId]);

  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !selectedTeamId) {
      toast.error("Veuillez entrer un nom de canal");
      return;
    }

    setIsCreating(true);
    const channel = await createChannel({
      teamId: selectedTeamId,
      displayName: newChannelName,
      description: newChannelDesc || undefined,
      membershipType: newChannelType,
    });

    if (channel) {
      setChannels([...channels, channel]);
      setIsCreateOpen(false);
      setNewChannelName(dealPrefix);
      setNewChannelDesc("");
      setNewChannelType("standard");
      toast.success(`Canal "${channel.displayName}" créé`);
      onChannelCreated?.(channel);
    }
    setIsCreating(false);
  };

  const refreshChannels = async () => {
    if (!selectedTeamId) return;
    setIsLoadingChannels(true);
    const data = await getTeamChannels(selectedTeamId);
    setChannels(data);
    setIsLoadingChannels(false);
  };

  if (isLoadingTeams) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Microsoft Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-9 w-full" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (teams.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Microsoft Teams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>Aucune équipe Teams trouvée ou non connecté</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Microsoft Teams
          </CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 h-7">
                <Plus className="h-3.5 w-3.5" />
                Canal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Nouveau canal
                </DialogTitle>
                <DialogDescription>
                  Créer un canal Teams dédié à ce dossier
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="channel-name">Nom du canal</Label>
                  <Input
                    id="channel-name"
                    placeholder="Ex: Dossier - Acquisition Target Corp"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel-desc">Description (optionnel)</Label>
                  <Textarea
                    id="channel-desc"
                    placeholder="Description du canal..."
                    value={newChannelDesc}
                    onChange={(e) => setNewChannelDesc(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type de canal</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewChannelType("standard")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 border rounded-lg text-sm transition-colors",
                        newChannelType === "standard" 
                          ? "border-primary bg-primary/5" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">Standard</span>
                      <span className="text-xs text-muted-foreground">Visible par tous</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewChannelType("private")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 border rounded-lg text-sm transition-colors",
                        newChannelType === "private" 
                          ? "border-primary bg-primary/5" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <Lock className="h-5 w-5" />
                      <span className="font-medium">Privé</span>
                      <span className="text-xs text-muted-foreground">Sur invitation</span>
                    </button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isCreating}>
                  Annuler
                </Button>
                <Button onClick={handleCreateChannel} disabled={isCreating || !newChannelName.trim()}>
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le canal
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Team Selector */}
        <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Sélectionner une équipe" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Channels List */}
        {isLoadingChannels ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Aucun canal dans cette équipe
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {channel.membershipType === "private" ? (
                      <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium truncate">{channel.displayName}</span>
                    {channel.membershipType === "private" && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0">
                        Privé
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0"
                    onClick={() => window.open(channel.webUrl, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Refresh button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 text-xs text-muted-foreground"
          onClick={refreshChannels}
          disabled={isLoadingChannels}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isLoadingChannels && "animate-spin")} />
          Actualiser
        </Button>
      </CardContent>
    </Card>
  );
}
