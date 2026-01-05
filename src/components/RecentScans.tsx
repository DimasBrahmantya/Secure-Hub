import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface ScanItem {
  _id: string;
  url: string;
  status: "Safe" | "Danger" | "Warning";
  threat: string;
  time: string;
  blocked?: boolean;
  reported?: boolean;
}

export default function RecentScans({ onScan }: { onScan: (url: string) => void }) {
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Gunakan environment variable dari Vite
  const API_URL = import.meta.env.VITE_API_URL;

  // Fungsi load data scans
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/phishing`);
      if (!res.ok) throw new Error("Failed to fetch scans");
      const data = await res.json();

      if (!Array.isArray(data)) return;

      // JANGAN ubah status — biarkan sesuai DB
      const merged = data.map(i => ({
        ...i,
        blocked: i.blocked ?? false,
        reported: i.reported ?? false,
      }));

      // hapus duplikat berdasarkan URL
      const unique = Array.from(new Map(merged.map(i => [i.url, i])).values());
      setScans(unique);
    } catch (err) {
      console.error("Failed to load scans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // BLOCK URL
  const blockUrl = async (url: string) => {
    try {
      const res = await fetch(`${API_URL}/phishing/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to block URL");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Gagal memblokir URL");
    }
  };

  // REPORT URL
  const reportUrl = async (url: string) => {
    try {
      const res = await fetch(`${API_URL}/phishing/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to report URL");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Gagal melaporkan URL");
    }
  };

  const statusStyles = {
    Safe: "bg-green-900 text-green-300 border border-green-400/40",
    Danger: "bg-red-900 text-red-300 border border-red-400/40",
    Warning: "bg-yellow-900 text-yellow-300 border border-yellow-400/40",
  };

  return (
    <div className="bg-[#2C2C2C] border border-black rounded-xl p-5 ">
      <h2 className="text-lg font-semibold text-white">Recent URL Scans</h2>
      <p className="text-sm text-gray-400 mb-4">Latest URLs analyzed by AI</p>

      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-300 text-sm border-b border-gray-700/60">
                <th className="py-2">URL</th>
                <th className="py-2">Status</th>
                <th className="py-2">Threat Level</th>
                <th className="py-2">Time</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {scans.map((item) => (
                <tr key={item._id} className="text-gray-200 text-sm border-b border-gray-700/40">
                  <td className="py-3 flex items-center gap-2">
                    {item.url}

                    {item.blocked && (
                      <span className="text-red-400 text-xs px-2 py-0.5 border border-red-400 rounded-md">
                        ⛔ Blocked
                      </span>
                    )}

                    {item.reported && (
                      <span className="text-yellow-400 text-xs px-2 py-0.5 border border-yellow-400 rounded-md">
                        ⚠ Reported
                      </span>
                    )}
                  </td>

                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3">{item.threat}</td>
                  <td className="py-3">{new Date(item.time).toLocaleString()}</td>

                  <td className="py-3 flex gap-3">
                    <button onClick={() => onScan(item.url)}>
                      <ExternalLink className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => blockUrl(item.url)}
                      className="text-red-400 text-xs underline"
                    >
                      Block
                    </button>

                    <button
                      onClick={() => reportUrl(item.url)}
                      className="text-yellow-400 text-xs underline"
                    >
                      Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
