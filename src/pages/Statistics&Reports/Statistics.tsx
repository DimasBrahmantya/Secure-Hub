import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { LogOut } from "lucide-react";

interface StatsData {
  users: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
  };
  reports: {
    totalReports: number;
    threatsBlocked: number;
  };
  system: {
    lastBackup: string;
    nextBackup: string;
    securityScore: string;
  };
}

export default function Statistics() {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/login");

  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // FETCH BACKEND /admin/stats
  // ================================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-black text-xl p-10">
        Loading statistics...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-red-600 text-xl p-10">
        Failed to load statistics data.
      </div>
    );
  }

  return (
    <div className="flex w-screen min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10 text-black">
        
        {/* ===== HEADER ===== */}
        <header className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Statistics & Reports</h1>
            <p className="text-black-300 mt-2">
              Detailed analytics and phishing detection reports
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
        </header>

        {/* ===== TOP 3 STAT CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Total Users */}
          <div className="bg-[#2c2c2c] p-6 rounded-xl border border-black-700 flex flex-col">
            <div className="text-white mb-2">Total Users</div>
            <div className="text-white text-3xl font-bold">
              {stats.users.totalUsers}
            </div>
            <p className="text-white mt-2">Registered Users</p>
          </div>

          {/* Active Users */}
          <div className="bg-[#2c2c2c] p-6 rounded-xl border border-black-700 flex flex-col">
            <div className="text-white mb-2">Active Users</div>
            <div className="text-white text-3xl font-bold">
              {stats.users.activeUsers}
            </div>
            <p className="text-white mt-2">Active Sessions</p>
          </div>

          {/* Admin Users */}
          <div className="bg-[#2c2c2c] p-6 rounded-xl border border-black-700 flex flex-col">
            <div className="text-white mb-2">Admin Users</div>
            <div className="text-white text-3xl font-bold">
              {stats.users.adminUsers}
            </div>
            <p className="text-white mt-2">System Administrators</p>
          </div>

        </div>

        {/* ===== 2 MAIN PANELS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

          {/* LEFT — Threat Categories */}
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">
              System Reports & Security
            </h3>

            {/* Total Reports */}
            <div className="mb-4">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Total Reports</span>
                <span>{stats.reports.totalReports}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div
                  className="h-full bg-blue-400 rounded"
                  style={{ width: `${stats.reports.totalReports || 1}%` }}
                ></div>
              </div>
            </div>

            {/* Threats Blocked */}
            <div className="mb-4">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Threats Blocked</span>
                <span>{stats.reports.threatsBlocked}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div
                  className="h-full bg-green-400 rounded"
                  style={{
                    width: `${
                      stats.reports.totalReports > 0
                        ? (stats.reports.threatsBlocked / stats.reports.totalReports) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

          </div>

          {/* RIGHT — Backup & Security */}
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Backup & System Health
            </h3>

            {/* Last Backup */}
            <div className="mb-5">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Last Backup</span>
                <span>{stats.system.lastBackup}</span>
              </div>
            </div>

            {/* Next Backup */}
            <div className="mb-5">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Next Backup</span>
                <span>{stats.system.nextBackup}</span>
              </div>
            </div>

            {/* Security Score */}
            <div className="mb-5">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Security Score</span>
                <span>{stats.system.securityScore}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div
                  className="h-full bg-purple-400 rounded"
                  style={{
                    width: String(stats.system.securityScore).replace("%", "") + "%",
                  }}
                ></div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-6">
              System statistics are updated based on user activity and security events.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
