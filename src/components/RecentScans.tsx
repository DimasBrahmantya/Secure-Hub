import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface ScanItem {
  url: string;
  status: "Safe" | "Danger" | "Warning";
  threat: string;
  time: string;
  blocked?: boolean;
  reported?: boolean;
}

const defaultScans: ScanItem[] = [
  {
    url: "https://secure-bank.com",
    status: "Safe",
    threat: "None",
    time: "5 min ago",
  },
  {
    url: "https://suspicious-login.xyz",
    status: "Danger",
    threat: "Phishing Detected",
    time: "15 min ago",
  },
  {
    url: "https://mycompany.com",
    status: "Safe",
    threat: "None",
    time: "3 hours ago",
  },
  {
    url: "https://fake-support.com",
    status: "Warning",
    threat: "Suspicious Content",
    time: "5 hours ago",
  },
];

const statusStyles = {
  Safe: "bg-green-900 text-green-300 border border-green-400/40",
  Danger: "bg-red-900 text-red-300 border border-red-400/40",
  Warning: "bg-yellow-900 text-yellow-300 border border-yellow-400/40",
};

export default function RecentScans({
  onScan,
}: {
  onScan: (url: string) => void;
}) {
  const [scans, setScans] = useState<ScanItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recent_scans") || "[]");
    const blocked = JSON.parse(localStorage.getItem("blocked_urls") || "[]");
    const reported = JSON.parse(localStorage.getItem("reported_urls") || "[]");

    // === FIX: Buat URL unik ===
    const map = new Map();
    const unique: ScanItem[] = [];

    [...stored, ...defaultScans].forEach((item) => {
      if (!map.has(item.url)) {
        map.set(item.url, true);
        unique.push(item);
      }
    });

    const updated = unique.map((item) => ({
      ...item,
      blocked: blocked.includes(item.url),
      reported: reported.includes(item.url),
    }));

    setScans(updated);
  }, []);

  return (
    <div className="bg-[#2C2C2C] border border-black rounded-xl p-5 ">
      <h2 className="text-lg font-semibold text-white">Recent URL Scans</h2>
      <p className="text-sm text-gray-400 mb-4">
        Latest URLs analyzed by AI
      </p>

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
            {scans.map((item, index) => (
              <tr
                key={index}
                className="text-gray-200 text-sm border-b border-gray-700/40"
              >
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
                <td className="py-3">{item.time}</td>

                <td className="py-3">
                  <button
                    onClick={() => onScan(item.url)}
                    className="inline-flex items-center hover:text-gray-300 transition"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
