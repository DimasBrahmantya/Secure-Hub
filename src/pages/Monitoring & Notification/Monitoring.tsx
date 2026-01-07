import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import NotificationItem from "../../components/NotificationItem";
import {
  Activity,
  AlertTriangle,
  CalendarCheck,
  Bell,
  LogOut,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Monitoring() {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/login");

  const [activities, setActivities] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMonitoring = async () => {
    try {
      const res = await fetch(`${API_URL}/monitoring`);
      if (!res.ok) throw new Error("Failed to fetch monitoring logs");
      const data = await res.json();
      setActivities(data.filter((d: any) => d.type === "activity"));
      setNotifications(data.filter((d: any) => d.type === "notification"));
    } catch (err) {
      console.error("Monitoring fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMonitoring();
    const interval = setInterval(fetchMonitoring, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 lg:ml-[296px]">
        {/* MOBILE MENU */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            <Menu className="w-5 h-5" />
            Menu
          </button>
        </div>

        {/* HEADER */}
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Monitoring & Notifications
            </h1>
            <p className="text-lg text-gray-700">
              Real-time activity logs and system alerts
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            <LogOut className="w-6 h-6" />
            Logout
          </button>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Active Sessions"
            value="12"
            subtitle="Currently Online"
            icon={<Activity className="w-10 h-10 text-blue-500" />}
          />
          <StatCard
            title="Pending Alerts"
            value={notifications.length.toString()}
            subtitle="Require Attention"
            icon={<AlertTriangle className="w-10 h-10 text-red-500" />}
          />
          <StatCard
            title="Events Today"
            value={activities.length.toString()}
            subtitle="Security events logged"
            icon={<CalendarCheck className="w-10 h-10 text-yellow-500" />}
          />
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="col-span-2 bg-[#2c2c2c] rounded-xl p-5 border border-black">
            <h2 className="text-xl font-bold text-white flex gap-2 items-center">
              <Activity className="w-6 h-6 text-blue-500" />
              Activity Log
            </h2>

            <div className="mt-4 max-h-[400px] overflow-y-auto flex flex-col gap-4">
              {activities.length === 0 ? (
                <p className="text-gray-400 text-sm">No activity found.</p>
              ) : (
                activities.map((item) => (
                  <NotificationItem
                    key={item._id}
                    title={item.title}
                    message={item.message}
                    time={new Date(item.time).toLocaleString()}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-[#2c2c2c] rounded-xl p-5 border border-black">
            <h2 className="text-xl font-bold text-white flex gap-2 items-center">
              <Bell className="w-6 h-6 text-red-500" />
              Notifications
            </h2>

            <div className="mt-4 max-h-[400px] overflow-y-auto flex flex-col gap-4">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No notifications available.
                </p>
              ) : (
                notifications.map((item) => (
                  <NotificationItem
                    key={item._id}
                    title={item.title}
                    message={item.message}
                    time={new Date(item.time).toLocaleString()}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
