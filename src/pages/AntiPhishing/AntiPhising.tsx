import { useState } from "react";
import {
  LogOut,
  CheckCircle,
  Shield,
  TriangleAlert,
  Search,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import Sidebar from "../../components/Sidebar";
import RecentScans from "../../components/RecentScans";
import { useNavigate } from "react-router-dom";

export default function AntiPhishing() {
  type Scan = {
    url: string;
    status: "Safe" | "Danger" | "Warning";
    threat: string;
    time: string;
  };
  const [url, setUrl] = useState("");
  const [scans, setScans] = useState<Scan[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => navigate("/login");

  const analyzeDomain = (domain: string | string[]) => {
    if (
      domain.includes("bank") ||
      domain.includes("secure") ||
      domain.includes("mycompany")
    ) {
      return { status: "Safe", threat: "None" };
    }

    if (
      domain.includes("phish") ||
      domain.includes("login") ||
      domain.includes("verify") ||
      domain.includes("update")
    ) {
      return { status: "Danger", threat: "Phishing Detected" };
    }

    return { status: "Warning", threat: "Suspicious Content" };
  };

  const handleCheck = () => {
    if (!url.trim()) return;

    const formatted =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    try {
      const domain = new URL(formatted).hostname.toLowerCase();

      // Tentukan status berdasarkan extension domain
      const safeExt = [".com", ".co.id", ".my.id", ".id", ".go.id"];
      const dangerExt = [".xyz", ".xxx", ".lol", ".icu", ".click"];

      let status: "Safe" | "Danger" | "Warning" = "Warning";
      let threat = "Suspicious Content";

      if (safeExt.some((ext) => domain.endsWith(ext))) {
        status = "Safe";
        threat = "None";
      } else if (dangerExt.some((ext) => domain.endsWith(ext))) {
        status = "Danger";
        threat = "Phishing Detected";
      }

      const newScan = {
        url: formatted,
        status,
        threat,
        time: "Just now",
      };

      // Ambil data lama
      let stored = localStorage.getItem("recent_scans");
      let list = stored ? JSON.parse(stored) : [];

      // Masukkan data baru di awal
      const updated = [newScan, ...list];

      // Simpan ke localStorage
      localStorage.setItem("recent_scans", JSON.stringify(updated));

      navigate(`/analysis?url=${encodeURIComponent(formatted)}`);
    } catch (err) {
      console.error("Invalid URL");
    }
  };

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        <header className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Anti-Phishing Scanner
            </h1>
            <p className="text-lg text-gray-700">
              AI-powered URL analysis and threat detection
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80"
          >
            <LogOut className="w-6 h-6" />
            Logout
          </button>
        </header>

        <div className="w-full text-white flex flex-col gap-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Safe URLs"
              value="156"
              subtitle="This Week"
              icon={<CheckCircle className="w-8 h-8 text-teal-400" />}
            />

            <StatCard
              title="Suspicious"
              value="8"
              subtitle="This Week"
              icon={<TriangleAlert className="w-8 h-8 text-yellow-400" />}
            />

            <StatCard
              title="Threats Blocked"
              value="23"
              subtitle="This Week"
              icon={<Shield className="w-8 h-8 text-red-400" />}
            />
          </div>

          {/* Input URL */}
          <div className="bg-[#2C2C2C] border-black rounded-xl p-5 flex flex-col gap-4">
            <label className="text-sm font-semibold">Masukkan URL</label>

            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="contoh.com"
                className="flex-1 bg-white-400 border border-white-700 rounded-lg px-4 py-3 text-sm text-white"
              />

              <button
                onClick={handleCheck}
                className="flex items-center gap-2 bg-teal-400 hover:bg-teal-500 rounded-lg px-6 py-3 font-semibold text-white"
              >
                <Search className="w-5 h-5" />
                Analyze
              </button>
            </div>
          </div>

          <RecentScans />
        </div>
      </main>
    </div>
  );
}
