import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  CheckCircle,
  Shield,
  TriangleAlert,
  Search,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import RecentScans from "../../components/RecentScans";

export default function AntiPhishing() {
  type Scan = {
    url: string;
    status: "Safe" | "Danger" | "Warning";
    threat: string;
    time: string;
    blocked?: boolean;
    reported?: boolean;
  };

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [url, setUrl] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    safe: 0,
    warning: 0,
    danger: 0,
    blocked: 0,
  });

  const handleLogout = () => navigate("/login");

  // ========================== FETCH STATISTICS ==========================
  const loadStats = async () => {
    try {
      const res = await fetch(`${API_URL}/phishing`);
      if (!res.ok) throw new Error("Failed to fetch phishing stats");

      const data: Scan[] = await res.json();
      if (!Array.isArray(data)) return;

      const safe = data.filter((i) => i.status === "Safe").length;
      const warning = data.filter((i) => i.status === "Warning").length;
      const danger = data.filter((i) => i.status === "Danger").length;
      const blocked = data.filter((i) => i.blocked === true).length;

      setStats({ safe, warning, danger, blocked });
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const refreshAfterAction = () => loadStats();

  // ========================== SCAN URL ==========================
  const handleCheck = async (manualURL?: string) => {
    const targetURL = manualURL ?? url;
    if (!targetURL.trim()) return;

    const formatted =
      targetURL.startsWith("http://") || targetURL.startsWith("https://")
        ? targetURL
        : `https://${targetURL}`;

    try {
      const res = await fetch(`${API_URL}/phishing/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formatted }),
      });

      if (!res.ok) throw new Error("Failed to scan URL");

      refreshAfterAction();
      navigate(`/analysis?url=${encodeURIComponent(formatted)}`);
    } catch (err) {
      console.error("Scan failed:", err);
      alert("Scan gagal, silakan coba lagi.");
    }
  };

  const handleRescan = (selectedURL: string) => {
    setUrl(selectedURL);
    handleCheck(selectedURL);
  };

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 lg:ml-[296px]">
        {/* MOBILE MENU */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            Menu
          </button>
        </div>

        {/* HEADER */}
        <header className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Anti-Phishing Scanner
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              AI-powered URL analysis and threat detection
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80"
          >
            <LogOut className="w-6 h-6" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </header>

        <div className="w-full flex flex-col gap-6">
          {/* ========================== STAT CARDS ========================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Safe URLs"
              value={String(stats.safe)}
              subtitle="Total Scanned"
              icon={<CheckCircle className="w-8 h-8 text-teal-400" />}
            />

            <StatCard
              title="Suspicious"
              value={String(stats.warning)}
              subtitle="Total Scanned"
              icon={<TriangleAlert className="w-8 h-8 text-yellow-400" />}
            />

            <StatCard
              title="Threats Blocked"
              value={String(stats.blocked)}
              subtitle="Total Blocked URLs"
              icon={<Shield className="w-8 h-8 text-red-400" />}
            />
          </div>

          {/* ========================== URL INPUT ========================== */}
          <div className="bg-[#2C2C2C] rounded-xl p-5 flex flex-col gap-4 text-white">
            <label className="text-xl sm:text-2xl font-semibold">
              Analyze URL
            </label>

            <p className="text-sm opacity-80">
              Enter a URL to scan for potential phishing threats
            </p>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="contoh.com"
                className="flex-1 bg-[#1E1E1E] border border-gray-700 rounded-lg px-4 py-2 sm:py-3 text-sm text-white"
              />

              <button
                onClick={() => handleCheck()}
                className="flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-500 rounded-lg px-5 py-2 sm:px-6 sm:py-3 font-semibold text-white"
              >
                <Search className="w-5 h-5" />
                Analyze
              </button>
            </div>
          </div>

          {/* ========================== RECENT SCANS ========================== */}
          <RecentScans
            onScan={(url: string) => {
              handleRescan(url);
              refreshAfterAction();
            }}
          />
        </div>
      </main>
    </div>
  );
}
