"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { changePassword, completeOnboarding } from "@/lib/actions/user-management";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Shield, LayoutDashboard, Settings } from "lucide-react";

export function OnboardingManager() {
  const { data: session, update } = useSession();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  interface ExtendedUser {
    mustChangePassword?: boolean;
    hasSeenOnboarding?: boolean;
  }
  const mustChange = (session?.user as unknown as ExtendedUser)?.mustChangePassword;
  const hasSeen = (session?.user as unknown as ExtendedUser)?.hasSeenOnboarding;

  useEffect(() => {
    // If user is logged in, no password change needed, and hasn't seen onboarding -> Show Tour
    if (session?.user && mustChange === false && hasSeen === false) {
       // eslint-disable-next-line react-hooks/set-state-in-effect
       setShowTour(true);
    }
  }, [session, mustChange, hasSeen]);

  const handleChangePwd = async () => {
    if (pwd.length < 6) return;
    setLoading(true);
    await changePassword(pwd);
    await update(); // Refresh session to get updated flags
    setLoading(false);
  };

  const handleTourComplete = async () => {
    await completeOnboarding();
    await update();
    setShowTour(false);
  };

  // 1. Password Change Enforcement
  if (mustChange) {
    return (
      <Dialog open={true}>
        <DialogContent 
          className="sm:max-w-[425px]" 
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="mx-auto bg-amber-100 p-3 rounded-full mb-4 w-fit">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <DialogTitle className="text-center">Sécurité du compte</DialogTitle>
            <DialogDescription className="text-center">
              Pour votre première connexion, veuillez définir un mot de passe personnalisé.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pwd">Nouveau mot de passe</Label>
              <Input 
                id="pwd" 
                type="password" 
                value={pwd} 
                onChange={(e) => setPwd(e.target.value)} 
                placeholder="6 caractères minimum"
              />
            </div>
          </div>
          <DialogFooter>
             <Button onClick={handleChangePwd} disabled={loading || pwd.length < 6} className="w-full">
               {loading ? "Mise à jour..." : "Définir mon mot de passe"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 2. Onboarding Tour
  if (showTour) {
     const tours = [
        { 
          title: "Bienvenue sur Alecia", 
          content: "Votre nouvel espace d'administration complet. Prenez quelques secondes pour faire le tour.",
          icon: Rocket 
        },
        { 
          title: "Pilotez votre activité", 
          content: "Suivez vos deals, gérez votre carnet d'adresses et accédez à vos documents depuis le menu de navigation.",
          icon: LayoutDashboard 
        },
        { 
          title: "Personnalisez tout", 
          content: "Gérez l'équipe, les actualités et les paramètres du site vitrine en toute autonomie.",
          icon: Settings
        },
     ];
     
     const CurrentIcon = tours[tourStep].icon;

     return (
       <Dialog open={true}>
         <DialogContent className="bg-zinc-950 text-white border-zinc-800 sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[var(--accent)] p-4 rounded-full shadow-lg shadow-[var(--accent)]/20">
             <CurrentIcon className="w-8 h-8 text-black" />
           </div>
           
           <div className="mt-8 text-center space-y-4">
             <h2 className="text-2xl font-bold text-white">{tours[tourStep].title}</h2>
             <p className="text-zinc-400 text-lg leading-relaxed">
               {tours[tourStep].content}
             </p>
           </div>

           <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-900">
             <div className="flex gap-1">
               {tours.map((_, i) => (
                 <div key={i} className={`h-1.5 rounded-full transition-all ${i === tourStep ? "w-6 bg-[var(--accent)]" : "w-1.5 bg-zinc-800"}`} />
               ))}
             </div>
             
             <Button 
               onClick={() => {
                  if (tourStep < tours.length - 1) setTourStep(tourStep + 1);
                  else handleTourComplete();
               }} 
               className="bg-[var(--accent)] text-black hover:bg-white transition-colors font-medium px-6"
             >
               {tourStep < tours.length - 1 ? "Suivant" : "C'est parti !"}
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     );
  }

  return null;
}
