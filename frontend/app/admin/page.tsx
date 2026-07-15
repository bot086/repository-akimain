"use client";

import { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = sessionStorage.getItem("admin_secret");
    if (saved) setSecret(saved);
  }, []);

  const handleLogin = (key: string) => {
    sessionStorage.setItem("admin_secret", key);
    setSecret(key);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_secret");
    setSecret(null);
  };

  // Prevent hydration mismatch by returning null until mounted
  if (!isMounted) return null;

  if (!secret) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard secret={secret} onLogout={handleLogout} />;
}
