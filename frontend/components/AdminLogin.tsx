"use client";

import { useState } from "react";

const API = ""; // Same-origin — internal Next.js API routes

export default function AdminLogin({ onLogin }: { onLogin: (secret: string) => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Verify the key against a dedicated verify endpoint
      const res = await fetch(`${API}/api/admin/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${secret.trim()}`,
        },
      });

      if (res.ok) {
        onLogin(secret.trim());
      } else if (res.status === 401 || res.status === 403) {
        setError("Incorrect secret key. Please try again.");
      } else {
        setError("Backend unreachable. Is the server running?");
      }
    } catch {
      setError("Could not connect to the backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-soft">
      <form onSubmit={handleSubmit} className="p-8 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl max-w-sm w-full border border-ink/5">
        <h1 className="text-2xl font-bold mb-6 text-ink font-serif">Admin Access</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-ink/70 mb-2">Secret Key</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => { setSecret(e.target.value); setError(""); }}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gold bg-transparent text-ink transition ${
              error ? "border-red-400" : "border-ink/20"
            }`}
            placeholder="Enter secret key..."
            autoFocus
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !secret.trim()}
          className="w-full bg-ink text-cream py-3 rounded-lg font-medium hover:bg-ink-soft transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Verifying...
            </>
          ) : (
            "Access Dashboard"
          )}
        </button>
      </form>
    </div>
  );
}
