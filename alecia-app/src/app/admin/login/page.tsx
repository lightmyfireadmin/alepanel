"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Shield } from "lucide-react";
import Image from "next/image";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function AdminLoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError("Impossible de charger les utilisateurs");
        }
      } catch {
        setError("Erreur lors du chargement des utilisateurs");
      } finally {
        setIsFetchingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: selectedEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Utilisateur ou mot de passe incorrect");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent)]/3 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                             linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Card className="w-full max-w-md bg-[var(--card)] border-[var(--border)] shadow-2xl relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/alecia_logo.svg"
              alt="alecia"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[var(--accent)]" />
            <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)] text-xl">
              Administration
            </CardTitle>
          </div>
          <CardDescription className="text-[var(--foreground-muted)]">
            Connectez-vous pour accéder au tableau de bord
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="user" className="text-[var(--foreground)] text-sm font-medium">
                Utilisateur
              </Label>
              {isFetchingUsers ? (
                <div className="flex items-center justify-center h-11 border border-[var(--border)] rounded-md bg-[var(--input)]">
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--foreground-muted)]" />
                </div>
              ) : (
                <Select value={selectedEmail} onValueChange={setSelectedEmail} required>
                  <SelectTrigger 
                    id="user"
                    className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] h-11 focus:border-[var(--accent)] focus:ring-[var(--accent)]/20 w-full"
                  >
                    <SelectValue placeholder="Sélectionnez un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.email}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--foreground)] text-sm font-medium">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] h-11 focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-500 text-center">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full rounded-lg h-11 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

