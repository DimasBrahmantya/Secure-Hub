import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import RecentActivity from "../../components/RecentActivity";
import FeatureCard from "../../components/FeatureCard";
import {
  CheckCircle,
  Database,
  Shield,
  Activity,
  TrendingUp,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => navigate("/login");

  const stats = [
    {
      title: "Security Status",
      value: "Protected",
      subtitle: "All systems operational",
      icon: <CheckCircle className="w-6 h-6 text-teal-400" strokeWidth={2.5} />,
    },
    {
      title: "Last Backup",
      value: "2 hours ago",
      subtitle: "Next backup in 22 hours",
      icon: <Database className="w-7 h-7 text-orange-500" />,
    },
    {
      title: "Threats Blocked",
      value: "127",
      subtitle: "This week",
      icon: <Shield className="w-7 h-7 text-red-600" />,
    },
    {
      title: "Active Monitoring",
      value: "24/7",
      subtitle: "Real-time protection",
      icon: <Activity className="w-7 h-7 text-blue-500" strokeWidth={3} />,
    },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Anti-Phishing Protection",
      description: "AI-powered threat detection and prevention",
      stats: [
        { label: "URLs Analyzed Today", value: "48" },
        { label: "Threats Detected", value: "3" },
      ],
      buttonText: "Go to Anti-Phising",
      navigateTo: "/antiphishing",
    },
    {
      icon: <Database className="w-7 h-7 text-orange-500" />,
      title: "Backup & Restore",
      description: "Secure data backup and recovery",
      stats: [
        { label: "Total Backups", value: "156" },
        { label: "Storage Used", value: "45.2 GB" },
      ],
      buttonText: "Manage Backup",
      navigateTo: "/backup",
    },
    {
      icon: <Activity className="w-7 h-7 text-blue-500" strokeWidth={3} />,
      title: "System Monitoring",
      description: "Real-time activity logs and alerts",
      stats: [
        { label: "Active Sessions", value: "12" },
        { label: "Pending Alert", value: "2" },
      ],
      buttonText: "View Notifications",
      navigateTo: "/monitoring",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-500" strokeWidth={3} />,
      title: "Admin Panel",
      description: "System configuration and management",
      stats: [
        { label: "Total Users", value: "24" },
        { label: "AI Sensitivity", value: "High" },
      ],
      buttonText: "Admin Panel",
      navigateTo: "/admin",
    },
  ];

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        <header className="flex justify-between items-start mb-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Security Dashboard
            </h1>
            <p className="text-xl md:text-2xl text-gray-700">
              Monitor and manage your security infrastructure
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
            />
          ))}
        </section>

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

        <RecentActivity />
      </main>
    </div>
  );
}