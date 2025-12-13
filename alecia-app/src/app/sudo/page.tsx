"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  checkSudoSession,
  sudoLogout,
  runHealthChecks,
  executeSql,
  getAllUsers,
  deleteUser,
  forcePasswordReset,
  purgeAllCaches,
  getEnvKeys,
} from "@/lib/actions/sudo";

/**
 * SUDO PANEL - God Mode
 * 
 * Developer-only maintenance interface.
 * Function over Form. Raw HTML. Speed is key.
 */
export default function SudoPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Health Check State
  const [healthResults, setHealthResults] = useState<Array<{
    service: string;
    status: "OK" | "ERROR";
    latency: number;
    error?: string;
  }>>([]);
  const [healthLoading, setHealthLoading] = useState(false);

  // SQL Runner State
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM users LIMIT 10;");
  const [sqlResult, setSqlResult] = useState<string>("");
  const [sqlLoading, setSqlLoading] = useState(false);

  // Users State
  const [users, setUsers] = useState<Array<{
    id: string;
    email: string;
    name: string;
    role: string | null;
    createdAt: Date | null;
  }>>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Cache State
  const [cacheMessage, setCacheMessage] = useState("");
  const [envKeys, setEnvKeys] = useState<Array<{
    key: string;
    isPublic: boolean;
    hasValue: boolean;
  }>>([]);

  const loadEnvKeys = async () => {
    const keys = await getEnvKeys();
    setEnvKeys(keys);
  };

  // Check authentication on mount
  useEffect(() => {
    checkSudoSession().then((isAuth) => {
      if (!isAuth) {
        router.push("/sudo/login");
      } else {
        setAuthenticated(true);
        setLoading(false);
        loadEnvKeys();
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await sudoLogout();
    router.push("/sudo/login");
  };

  const handleHealthCheck = async () => {
    setHealthLoading(true);
    const results = await runHealthChecks();
    setHealthResults(results);
    setHealthLoading(false);
  };

  const handleExecuteSql = async () => {
    setSqlLoading(true);
    setSqlResult("");
    const result = await executeSql(sqlQuery);
    setSqlResult(JSON.stringify(result, null, 2));
    setSqlLoading(false);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.users);
    }
    setUsersLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("DELETE THIS USER? This cannot be undone.")) return;
    const result = await deleteUser(userId);
    if (result.success) {
      loadUsers();
    } else {
      alert(result.error);
    }
  };

  const handleResetPassword = async () => {
    if (!resetUserId || !newPassword) return;
    const result = await forcePasswordReset(resetUserId, newPassword);
    if (result.success) {
      alert("Password reset successfully");
      setResetUserId(null);
      setNewPassword("");
    } else {
      alert(result.error);
    }
  };

  const handlePurgeCache = async () => {
    if (!confirm("PURGE ALL CACHES?")) return;
    const result = await purgeAllCaches();
    setCacheMessage(result.message);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#0f0" }}>AUTHENTICATING...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>⚠️ SUDO PANEL</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          LOGOUT
        </button>
      </div>

      {/* Health Check Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>1. API HEALTH CHECK</h2>
        <button onClick={handleHealthCheck} disabled={healthLoading} style={styles.btn}>
          {healthLoading ? "CHECKING..." : "RUN HEALTH CHECK"}
        </button>
        
        {healthResults.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Service</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Latency</th>
                <th style={styles.th}>Error</th>
              </tr>
            </thead>
            <tbody>
              {healthResults.map((r, i) => (
                <tr key={i}>
                  <td style={styles.td}>{r.service}</td>
                  <td style={{
                    ...styles.td,
                    color: r.status === "OK" ? "#0f0" : "#f00",
                    fontWeight: "bold",
                  }}>
                    {r.status}
                  </td>
                  <td style={styles.td}>{r.latency}ms</td>
                  <td style={{ ...styles.td, color: "#f00" }}>{r.error || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* SQL Runner Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>2. SQL RUNNER ⚠️ DANGER ZONE</h2>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          style={styles.textarea}
          rows={6}
          placeholder="SELECT * FROM users;"
        />
        <button onClick={handleExecuteSql} disabled={sqlLoading} style={styles.dangerBtn}>
          {sqlLoading ? "EXECUTING..." : "EXECUTE SQL"}
        </button>
        
        {sqlResult && (
          <pre style={styles.pre}>{sqlResult}</pre>
        )}
      </section>

      {/* User Management Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>3. USER MANAGEMENT</h2>
        <button onClick={loadUsers} disabled={usersLoading} style={styles.btn}>
          {usersLoading ? "LOADING..." : "LOAD USERS"}
        </button>
        
        {users.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.role || "user"}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => setResetUserId(user.id)}
                      style={styles.smallBtn}
                    >
                      RESET PWD
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ ...styles.smallBtn, background: "#f00" }}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Password Reset Modal */}
        {resetUserId && (
          <div style={styles.modal}>
            <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Force Password Reset</h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 6 chars)"
              style={styles.input}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleResetPassword} style={styles.btn}>
                RESET
              </button>
              <button onClick={() => setResetUserId(null)} style={styles.smallBtn}>
                CANCEL
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Cache & System Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>4. CACHE & SYSTEM</h2>
        
        <button onClick={handlePurgeCache} style={styles.dangerBtn}>
          PURGE ALL CACHES
        </button>
        
        {cacheMessage && (
          <p style={{ color: "#0f0", marginTop: "0.5rem" }}>{cacheMessage}</p>
        )}

        <h3 style={{ color: "#888", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          Environment Variables
        </h3>
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Key</th>
              <th style={styles.th}>Public?</th>
              <th style={styles.th}>Has Value?</th>
            </tr>
          </thead>
          <tbody>
            {envKeys.map((env) => (
              <tr key={env.key}>
                <td style={styles.td}>{env.key}</td>
                <td style={{ ...styles.td, color: env.isPublic ? "#0f0" : "#666" }}>
                  {env.isPublic ? "YES" : "no"}
                </td>
                <td style={{ ...styles.td, color: env.hasValue ? "#0f0" : "#f00" }}>
                  {env.hasValue ? "✓" : "✗"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Alecia Sudo Panel v1.0 | Session expires in 4 hours</p>
      </footer>
    </div>
  );
}

// Raw inline styles - Function over Form
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#ccc",
    fontFamily: "monospace",
    padding: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #333",
    paddingBottom: "1rem",
    marginBottom: "1.5rem",
  },
  title: {
    color: "#f00",
    fontSize: "1.5rem",
    margin: 0,
  },
  logoutBtn: {
    background: "#333",
    border: "1px solid #666",
    color: "#fff",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontFamily: "monospace",
  },
  section: {
    marginBottom: "2rem",
    padding: "1rem",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "4px",
  },
  sectionTitle: {
    color: "#0f0",
    fontSize: "1rem",
    marginBottom: "1rem",
    borderBottom: "1px solid #333",
    paddingBottom: "0.5rem",
  },
  btn: {
    background: "#333",
    border: "1px solid #666",
    color: "#0f0",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontFamily: "monospace",
    marginRight: "0.5rem",
  },
  dangerBtn: {
    background: "#300",
    border: "1px solid #f00",
    color: "#f00",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontFamily: "monospace",
  },
  smallBtn: {
    background: "#333",
    border: "1px solid #666",
    color: "#fff",
    padding: "0.25rem 0.5rem",
    cursor: "pointer",
    fontFamily: "monospace",
    marginRight: "0.25rem",
    fontSize: "0.75rem",
  },
  textarea: {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "#0f0",
    fontFamily: "monospace",
    fontSize: "0.875rem",
    padding: "0.75rem",
    marginBottom: "0.5rem",
    resize: "vertical",
  },
  pre: {
    background: "#1a1a1a",
    border: "1px solid #333",
    padding: "1rem",
    overflow: "auto",
    maxHeight: "300px",
    fontSize: "0.75rem",
    color: "#0f0",
    marginTop: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    fontSize: "0.875rem",
  },
  th: {
    background: "#1a1a1a",
    border: "1px solid #333",
    padding: "0.5rem",
    textAlign: "left",
    color: "#888",
  },
  td: {
    border: "1px solid #333",
    padding: "0.5rem",
    color: "#ccc",
  },
  input: {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "#0f0",
    fontFamily: "monospace",
    padding: "0.5rem",
    marginBottom: "0.5rem",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#1a1a1a",
    border: "2px solid #f00",
    padding: "1.5rem",
    zIndex: 1000,
    minWidth: "300px",
  },
  footer: {
    textAlign: "center",
    color: "#444",
    fontSize: "0.75rem",
    marginTop: "2rem",
    paddingTop: "1rem",
    borderTop: "1px solid #222",
  },
};
