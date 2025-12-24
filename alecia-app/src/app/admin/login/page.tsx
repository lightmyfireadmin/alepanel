import { getLoginUsers } from "@/lib/actions/auth-users";
import { LoginForm } from "./LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminLoginPage() {
  const users = await getLoginUsers();

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

      {/* Back Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 z-50 p-2 rounded-full bg-[var(--card)]/50 border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <LoginForm users={users} />
    </main>
  );
}