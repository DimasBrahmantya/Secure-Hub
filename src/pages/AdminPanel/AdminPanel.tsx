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
  Menu,
} from "lucide-react";

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
  const API_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState<DashboardStats>({
    users: { totalUsers: 0, activeUsers: 0, adminUsers: 0 },
    system: { aiSensitivity: "-", securityScore: "-" },
    reports: { totalReports: 0, threatsBlocked: 0 },
  });

  const [actions, setActions] = useState<AdminAction[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchActions();
  }, []);

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/admin/stats`);
    if (res.ok) setStats(await res.json());
  };

  const fetchActions = async () => {
    try {
      setLoadingActions(true);
      const res = await fetch(`${API_URL}/admin/actions`);
      if (res.ok) setActions(await res.json());
    } finally {
      setLoadingActions(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN */}
      <main className="flex-1 p-5 sm:p-6 md:p-8 lg:p-10 lg:ml-[296px]">
        {/* DESKTOP HEADER */}
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden bg-gray-900 text-white p-2 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-sm sm:text-base text-gray-700">
                  System configuration and management dashboard
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg w-fit"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:block font-semibold">Logout</span>
            </button>
          </div>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={stats.users.totalUsers.toString()}
            subtitle={`Active: ${stats.users.activeUsers}`}
            icon={<Users className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />}
          />

          <StatCard
            title="System Health"
            value={stats.system.securityScore}
            subtitle={`AI Sensitivity: ${stats.system.aiSensitivity}`}
            icon={<Server className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />}
          />

          <StatCard
            title="AI Sensitivity"
            value={stats.system.aiSensitivity}
            subtitle="Detection level"
            icon={<Shield className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />}
          />

          <StatCard
            title="Security Score"
            value={stats.system.securityScore}
            subtitle="Overall rating"
            icon={<Gauge className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />}
          />
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <FeatureCard
            icon={<UserCog className="w-7 h-7 text-yellow-500" />}
            title="User Management"
            description="Manage user accounts, roles, and permissions"
            stats={[
              {
                label: "Active Users",
                value: stats.users.activeUsers.toString(),
              },
              {
                label: "Admin Users",
                value: stats.users.adminUsers.toString(),
              },
            ]}
            buttonText="Manage Users"
            navigateTo="/users"
          />

          <FeatureCard
            icon={<BarChart2 className="w-7 h-7 text-green-500" />}
            title="Statistics & Report"
            description="View analytics and security reports"
            stats={[
              {
                label: "Total Reports",
                value: stats.reports.totalReports.toString(),
              },
              {
                label: "Threats Blocked",
                value: stats.reports.threatsBlocked.toString(),
              },
            ]}
            buttonText="View Statistics"
            navigateTo="/statistics"
          />
        </div>

        {/* RECENT ACTIONS */}
        <div className="bg-[#2c2c2c] rounded-xl p-5 sm:p-6 mt-10">
          <h3 className="text-xl font-semibold text-white">
            Recent Administrative Actions
          </h3>

          <div className="mt-6 flex flex-col gap-5">
            {loadingActions ? (
              <p className="text-gray-300">Loading...</p>
            ) : actions.length === 0 ? (
              <p className="text-gray-500">No recent actions</p>
            ) : (
              actions.map((a) => (
                <div
                  key={a._id}
                  className="border-b border-gray-700 pb-4 flex flex-col sm:flex-row sm:justify-between gap-2"
                >
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
