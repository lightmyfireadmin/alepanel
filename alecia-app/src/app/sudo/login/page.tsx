"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sudoLogin } from "@/lib/actions/sudo";

/**
 * Sudo Panel Login
 * 
 * Simple, raw login form. Function over form.
 */
export default function SudoLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await sudoLogin(password);

    if (result.success) {
      router.push("/sudo");
      router.refresh();
    } else {
      setError(result.error || "Authentication failed");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
    }}>
      <div style={{
        background: "#111",
        border: "1px solid #333",
        padding: "2rem",
        borderRadius: "4px",
        width: "100%",
        maxWidth: "400px",
      }}>
        <h1 style={{ 
          color: "#f00", 
          marginBottom: "1rem",
          fontSize: "1.5rem",
          textAlign: "center",
        }}>
          ⚠️ SUDO PANEL
        </h1>
        
        <p style={{ 
          color: "#666", 
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          textAlign: "center",
        }}>
          Developer Access Only
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="SUDO_PWD"
            autoFocus
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "4px",
              color: "#0f0",
              fontFamily: "monospace",
              fontSize: "1rem",
              marginBottom: "1rem",
            }}
          />

          {error && (
            <div style={{
              color: "#f00",
              padding: "0.5rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
              background: "rgba(255,0,0,0.1)",
              borderRadius: "4px",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: loading ? "#333" : "#f00",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              fontFamily: "monospace",
              fontSize: "1rem",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "AUTHENTICATING..." : "AUTHENTICATE"}
          </button>
        </form>

        <p style={{
          color: "#444",
          marginTop: "1.5rem",
          fontSize: "0.75rem",
          textAlign: "center",
        }}>
          This panel is logged. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
