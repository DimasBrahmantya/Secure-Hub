import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import RecentActivity from "../../components/RecentActivity";
import FeatureCard from "../../components/FeatureCard";
import {
  Shield,
  Database,
  Activity,
  TrendingUp,
  CheckCircle,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getDashboardStats,
  getDashboardActivity,
  getDashboardOverview,
} from "../../api/dashboard";

export default function Dashboard() {

  const [topStats, setTopStats] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  interface ActivityItem {
    time: any;
    description?: string;
  }

  const [activity, setActivity] = useState<ActivityItem[]>([]);


  useEffect(() => {
    const load = async () => {
      const s = await getDashboardStats(); // stat cards
      const o = await getDashboardOverview(); // feature cards
      const a = await getDashboardActivity();

      setTopStats(s);
      setDashboardStats(o);
      setActivity(
        (Array.isArray(a) ? a : []).map((item: any) => ({
          time: item.time ?? item.createdAt ?? null,
          description: item.message ?? item.title ?? "-",
        }))
      );
    };

    load();
  }, []);

  const features = dashboardStats
    ? [
        {
          icon: <Shield className="w-8 h-8 text-red-600" />,
          title: "Anti-Phishing Protection",
          description: "AI-powered threat detection and prevention",
          stats: [
            {
              label: "URLs Analyzed Today",
              value: String(dashboardStats.phishing?.urlsAnalyzedToday ?? 0),
            },
            {
              label: "Threats Detected",
              value: String(dashboardStats.phishing?.threatsDetected ?? 0),
            },
          ],
          buttonText: "Go to Anti-Phishing",
          navigateTo: "/antiphishing",
        },
        {
          icon: <Database className="w-7 h-7 text-orange-500" />,
          title: "Backup & Restore",
          description: "Secure data backup and recovery",
          stats: [
            {
              label: "Total Backups",
              value: String(dashboardStats.backup?.total ?? 0),
            },
            {
              label: "Storage Used",
              value: dashboardStats.backup?.storageUsed ?? "0 GB",
            },
          ],
          buttonText: "Manage Backup",
          navigateTo: "/backup",
        },
        {
          icon: <Activity className="w-7 h-7 text-blue-500" strokeWidth={3} />,
          title: "System Monitoring",
          description: "Real-time activity logs and alerts",
          stats: [
            {
              label: "Active Sessions",
              value: String(dashboardStats.monitoring?.activeSessions ?? 0),
            },
            {
              label: "Pending Alerts",
              value: String(dashboardStats.monitoring?.pendingAlerts ?? 0),
            },
          ],
          buttonText: "View Notifications",
          navigateTo: "/monitoring",
        },
        {
          icon: (
            <TrendingUp className="w-8 h-8 text-green-500" strokeWidth={3} />
          ),
          title: "Admin Panel",
          description: "System configuration and management",
          stats: [
            {
              label: "Total Users",
              value: String(dashboardStats.admin?.totalUsers ?? "—"),
            },
            {
              label: "AI Sensitivity",
              value: dashboardStats.admin?.aiSensitivity ?? "—",
            },
          ],
          buttonText: "Admin Panel",
          navigateTo: "/admin",
        },
      ]
    : [];

  const statIcons = [
    <CheckCircle className="w-6 h-6 text-teal-400" strokeWidth={2.5} />,
    <Database className="w-7 h-7 text-orange-500" />,
    <Shield className="w-7 h-7 text-red-600" />,
    <Activity className="w-7 h-7 text-blue-500" strokeWidth={3} />,
  ];

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6 lg:ml-[296px]">
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
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Security Dashboard
            </h1>
            <p className="text-gray-700 hidden md:block">
              Monitor and manage your security infrastructure
            </p>
          </div>
        </header>

        {/* TOP STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {topStats.length === 0 ? (
            // simple placeholders so layout doesn't break
            <>
              <StatCard
                title="Security Status"
                value="—"
                subtitle="—"
                icon={<Shield />}
              />
              <StatCard
                title="Last Backup"
                value="—"
                subtitle="—"
                icon={<Database />}
              />
              <StatCard
                title="Threats Blocked"
                value="—"
                subtitle="—"
                icon={<Shield />}
              />
              <StatCard
                title="Active Monitoring"
                value="—"
                subtitle="—"
                icon={<Activity />}
              />
            </>
          ) : (
            topStats.map((stat: any, idx: number) => (
              <StatCard
                key={idx}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={statIcons[idx] ?? <Shield />}
              />
            ))
          )}
        </section>

        {/* FEATURES */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              stats={feature.stats}
              buttonText={feature.buttonText}
              navigateTo={feature.navigateTo}
            />
          ))}
        </section>

        {/* RECENT ACTIVITY */}
        <RecentActivity activity={activity} />
      </main>
    </div>
  );
}
