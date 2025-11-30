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
  const navigate = useNavigate();

  const handleLogout = () => navigate("/login");

  const handleCheck = (manualURL?: string) => {
    const targetURL = manualURL ?? url;

    if (!targetURL.trim()) return;

    const formatted =
      targetURL.startsWith("http://") || targetURL.startsWith("https://")
        ? targetURL
        : `https://${targetURL}`;

    try {
      const domain = new URL(formatted).hostname.toLowerCase();

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

      // === FIX: Hilangkan duplikasi ===
      let stored = JSON.parse(localStorage.getItem("recent_scans") || "[]");
      const filtered = stored.filter((item: any) => item.url !== formatted);
      const updated = [newScan, ...filtered];

      localStorage.setItem("recent_scans", JSON.stringify(updated));

      navigate(`/analysis?url=${encodeURIComponent(formatted)}`);
    } catch (err) {
      console.error("Invalid URL");
    }
  };

  // Rescan handler
  const handleRescan = (selectedURL: string) => {
    setUrl(selectedURL);
    handleCheck(selectedURL);
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

          {/* Cards */}
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

          {/* Input */}
          <div className="bg-[#2C2C2C] border-black rounded-xl p-5 flex flex-col gap-4">
            <label className="text-2xl font-semibold ">Analyze URL</label>
            <p className="text-sm text-white-400">
              Enter a URL to scan for potential phishing threats
            </p>

            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="contoh.com"
                className="flex-1 bg-white-400 border border-white-700 rounded-lg px-4 py-3 text-sm text-white"
              />

              <button
                onClick={() => handleCheck()}
                className="flex items-center gap-2 bg-teal-400 hover:bg-teal-500 rounded-lg px-6 py-3 font-semibold text-white"
              >
                <Search className="w-5 h-5" />
                Analyze
              </button>
            </div>
          </div>

          {/* Recent Scans */}
          <RecentScans onScan={handleRescan} />

        </div>
      </main>
    </div>
  );
}
