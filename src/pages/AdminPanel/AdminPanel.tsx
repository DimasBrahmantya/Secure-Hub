import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "../../components/FeatureCard";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import {
  Users,
  Server,
  Shield,
  Gauge,
  UserCog,
  BarChart2,
  LogOut,
} from "lucide-react";

// ==============================
// INTERFACES
// ==============================
interface DashboardStats {
  users: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
  };
  system: {
    aiSensitivity: "-";
    securityScore: "-";
  };
  reports: {
    totalReports: number;
    threatsBlocked: number;
  };
}

interface AdminAction {
  _id: string;
  action: string;
  admin: string;
  timeAgo: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    users: { totalUsers: 0, activeUsers: 0, adminUsers: 0 },
    system: { aiSensitivity: "-", securityScore: "-" },
    reports: { totalReports: 0, threatsBlocked: 0 },
  });

  const [actions, setActions] = useState<AdminAction[]>([]);
  const [, setLoadingStats] = useState(false);
  const [loadingActions, setLoadingActions] = useState(false);

  // ==============================
  // API URL dari env
  // ==============================
  const API_URL = import.meta.env.VITE_API_URL;

  // ==============================
  // FETCH DATA
  // ==============================
  useEffect(() => {
    fetchStats();
    fetchActions();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch(`${API_URL}/admin/stats`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchActions = async () => {
    try {
      setLoadingActions(true);
      const res = await fetch(`${API_URL}/admin/actions`);
      if (!res.ok) throw new Error("Failed to fetch admin actions");
      const data = await res.json();
      setActions(data);
    } catch (error) {
      console.error("Failed to load admin actions:", error);
    } finally {
      setLoadingActions(false);
    }
  };

  // ==============================
  // RENDER LAYOUT
  // ==============================
  const handleLogout = () => navigate("/login");

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        {/* HEADER */}
        <header className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Admin Panel
            </h1>
            <p className="text-lg text-gray-700">
              System configuration and management dashboard
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

        {/* TOP STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={stats.users.totalUsers.toString()}
            subtitle={`Active: ${stats.users.activeUsers}`}
            icon={<Users className="w-10 h-10 text-yellow-500" />}
          />

          <StatCard
            title="System Health"
            value={stats.system.securityScore}
            subtitle={`AI Sensitivity: ${stats.system.aiSensitivity}`}
            icon={<Server className="w-10 h-10 text-green-500" />}
          />

          <StatCard
            title="AI Sensitivity"
            value={stats.system.aiSensitivity}
            subtitle="Detection level"
            icon={<Shield className="w-10 h-10 text-pink-500" />}
          />

          <StatCard
            title="Security Score"
            value={stats.system.securityScore}
            subtitle="Overall rating"
            icon={<Gauge className="w-10 h-10 text-red-500" />}
          />
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <FeatureCard
            icon={<UserCog className="w-8 h-8 text-yellow-500" />}
            title="User Management"
            description="Manage user accounts, roles, and permissions"
            stats={[
              { label: "Active Users", value: stats.users.activeUsers.toString() },
              { label: "Admin Users", value: stats.users.adminUsers.toString() },
            ]}
            buttonText="Manage Users"
            navigateTo="/users"
          />

          <FeatureCard
            icon={<BarChart2 className="w-8 h-8 text-green-500" />}
            title="Statistics & Report"
            description="View analytics and security reports"
            stats={[
              { label: "Total Reports", value: stats.reports.totalReports.toString() },
              { label: "Threats Blocked", value: stats.reports.threatsBlocked.toString() },
            ]}
            buttonText="View Statistics"
            navigateTo="/statistics"
          />
        </div>

        {/* RECENT ADMIN ACTIONS */}
        <div className="bg-[#2c2c2c] rounded-xl p-6 mt-10">
          <h3 className="text-xl font-semibold text-white">Recent Administrative Action</h3>
          <p className="text-gray-300 mt-1">Latest changes made by administrators</p>

          <div className="mt-6 flex flex-col gap-6">
            {loadingActions ? (
              <p className="text-gray-300">Loading...</p>
            ) : actions.length === 0 ? (
              <p className="text-gray-500">No recent actions</p>
            ) : (
              actions.map((a) => (
                <div key={a._id} className="border-b border-gray-700 pb-4 flex justify-between">
                  <div>
                    <p className="font-semibold text-white">{a.action}</p>
                    <p className="text-sm text-gray-400">by {a.admin}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{a.timeAgo}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
