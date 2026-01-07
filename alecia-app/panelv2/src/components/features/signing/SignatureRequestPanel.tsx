"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenLine, FileSignature, Send, Check, X, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
  signed: { label: "Signé", color: "bg-green-100 text-green-700", icon: <Check className="w-3 h-3" /> },
  rejected: { label: "Refusé", color: "bg-red-100 text-red-700", icon: <X className="w-3 h-3" /> },
  expired: { label: "Expiré", color: "bg-slate-100 text-slate-700", icon: <AlertTriangle className="w-3 h-3" /> },
};

const DOC_TYPE_LABELS: Record<string, string> = {
  nda: "NDA",
  loi: "LOI",
  mandate: "Mandat",
  contract: "Contrat",
  other: "Autre",
};

export function SignatureRequestPanel() {
  const myPending = useQuery(api.signing.getMyPendingSignatures);
  const allRequests = useQuery(api.signing.getSignRequests, { asRequester: true });
  const users = useQuery(api.users.getAllUsers);
  
  const createRequest = useMutation(api.signing.createSignRequest);
  const signDocument = useMutation(api.signing.signDocument);
  const rejectRequest = useMutation(api.signing.rejectSignRequest);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDocType, setNewDocType] = useState<any>("nda");
  const [newSignerId, setNewSignerId] = useState("");

  // Canvas for signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCreateRequest = async () => {
    if (!newTitle.trim() || !newSignerId) {
      toast.error("Titre et signataire requis");
      return;
    }

    try {
      await createRequest({
        title: newTitle,
        documentType: newDocType,
        signerId: newSignerId as any,
      });
      toast.success("Demande envoyée !");
      setIsDialogOpen(false);
      setNewTitle("");
    } catch (e) {
      toast.error("Erreur lors de l'envoi");
    }
  };

  const handleSign = async () => {
    if (!canvasRef.current || !selectedRequest) return;

    const signatureData = canvasRef.current.toDataURL("image/png");
    
    try {
      await signDocument({
        requestId: selectedRequest._id,
        signatureData,
      });
      toast.success("Document signé !");
      setSignDialogOpen(false);
      setSelectedRequest(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest({ requestId: requestId as any });
      toast.success("Demande refusée");
    } catch (e) {
      toast.error("Erreur");
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Signatures</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos demandes de signature
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Send className="w-4 h-4" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Demander une signature</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Titre du document"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Select value={newDocType} onValueChange={setNewDocType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nda">NDA</SelectItem>
                  <SelectItem value="loi">Lettre d'intention (LOI)</SelectItem>
                  <SelectItem value="mandate">Mandat</SelectItem>
                  <SelectItem value="contract">Contrat</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newSignerId} onValueChange={setNewSignerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le signataire" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateRequest}>Envoyer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1">
            <Clock className="w-3 h-3" />
            À signer ({myPending?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="sent">Envoyées</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-2 mt-4">
          {!myPending?.length ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <FileSignature className="w-10 h-10 mx-auto mb-2 opacity-50" />
                Aucune signature en attente
              </CardContent>
            </Card>
          ) : (
            myPending.map((req) => (
              <Card key={req._id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{req.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {DOC_TYPE_LABELS[req.documentType]} •{" "}
                      {formatDistanceToNow(req._creationTime, { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(req._id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(req);
                        setSignDialogOpen(true);
                        setTimeout(clearCanvas, 100);
                      }}
                    >
                      <PenLine className="w-4 h-4 mr-1" />
                      Signer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-2 mt-4">
          {!allRequests?.length ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune demande envoyée
              </CardContent>
            </Card>
          ) : (
            allRequests.map((req) => {
              const statusConfig = STATUS_CONFIG[req.status];
              return (
                <Card key={req._id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{req.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        À: {req.signerName} • {DOC_TYPE_LABELS[req.documentType]}
                      </p>
                    </div>
                    <Badge className={`gap-1 ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Signature Dialog */}
      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Signer: {selectedRequest?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Dessinez votre signature ci-dessous:
            </p>
            <div className="border rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <Button variant="ghost" size="sm" className="mt-2" onClick={clearCanvas}>
              Effacer
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSignDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSign} className="gap-1">
              <Check className="w-4 h-4" />
              Confirmer la signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
