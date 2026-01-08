import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Shield,
  TriangleAlert,
  Search,
  Menu,
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
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    {/* MAIN */}
    <main className="flex-1 w-full p-4 sm:p-6 lg:ml-[296px]">
      {/* MOBILE MENU */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Anti-Phishing Scanner
          </h1>
          <p className="text-gray-700 hidden md:block text-sm">
            AI-powered URL analysis and threat detection
          </p>
        </div>
      </header>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          title="Safe URLs"
          value={String(stats.safe)}
          subtitle="Total Scanned"
          icon={<CheckCircle className="w-7 h-7 text-teal-400" />}
        />

        <StatCard
          title="Suspicious"
          value={String(stats.warning)}
          subtitle="Total Scanned"
          icon={<TriangleAlert className="w-7 h-7 text-yellow-400" />}
        />

        <StatCard
          title="Threats Blocked"
          value={String(stats.blocked)}
          subtitle="Total Blocked URLs"
          icon={<Shield className="w-7 h-7 text-red-400" />}
        />
      </section>

      {/* ANALYZE URL */}
      <section className="bg-[#2C2C2C] p-4 sm:p-6 rounded-xl border border-black mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Search className="w-6 sm:w-7 h-6 sm:h-7 text-teal-400 flex-shrink-0" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Analyze URL
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Enter a URL to scan for potential phishing threats
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="contoh.com"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
          />

          <button
            onClick={() => handleCheck()}
            className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            <Search className="w-4 sm:w-5 h-4 sm:h-5" />
            Analyze
          </button>
        </div>
      </section>

      {/* RECENT SCANS */}
      <section className="bg-[#2C2C2C] p-3 sm:p-4 rounded-xl border border-black">
        <RecentScans
          onScan={(url: string) => {
            handleRescan(url);
            refreshAfterAction();
          }}
        />
      </section>
    </main>
  </div>
);
}
