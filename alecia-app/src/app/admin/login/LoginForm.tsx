"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Shield } from "lucide-react";
import Image from "next/image";

interface UserOption {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
}

export function LoginForm({ users }: { users: UserOption[] }) {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: selectedUser.email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants incorrects.");
        setIsLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      setError("Erreur de connexion.");
      setIsLoading(false);
    }
  };

  return (
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
            Sélectionnez votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[var(--foreground)] text-sm font-medium">Utilisateur</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] h-14">
                  <SelectValue>
                    {selectedUser && (
                        <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                            <AvatarImage src={selectedUser.avatar || ""} />
                            <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="font-medium leading-none">{selectedUser.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                        </div>
                        </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id} className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={user.avatar || ""} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="font-medium leading-none">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] h-11"
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
  );
}
