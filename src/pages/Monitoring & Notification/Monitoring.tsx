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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Monitoring() {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/login");

  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ===============================
  // FETCH MONITORING LOGS
  // ===============================
  const fetchMonitoring = () => {
    fetch("http://localhost:3000/monitoring")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.filter((d: any) => d.type === "activity"));
        setNotifications(data.filter((d: any) => d.type === "notification"));
      })
      .catch((err) => console.error("Monitoring fetch error:", err));
  };

  useEffect(() => {
    fetchMonitoring();
    const interval = setInterval(fetchMonitoring, 5000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        {/* PAGE HEADER */}
        <header className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Monitoring & Notifications
            </h1>
            <p className="text-lg text-gray-700">
              Real-time activity logs and system alerts
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

        {/* TOP STAT CARDS (3 ITEMS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Active Sessions"
            value="12"
            subtitle="Currently Online"
            icon={<Activity className="text-blue-500 w-10 h-10" />}
          />

          <StatCard
            title="Pending Alerts"
            value={notifications.length.toString()}
            subtitle="Require Attention"
            icon={<AlertTriangle className="text-red-500 w-10 h-10" />}
          />

          <StatCard
            title="Events Today"
            value={activities.length.toString()}
            subtitle="Security events logged"
            icon={<CalendarCheck className="text-yellow-500 w-10 h-10" />}
          />
        </div>

        {/* MAIN CONTENT: 2 COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          {/* LEFT COLUMN: ACTIVITY LOG */}
          <div className="col-span-2 bg-[#2c2c2c] border border-black rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500" />
              Activity Log
            </h2>
            <p className="text-sm text-gray-300">
              Real-time security events and system activities.
            </p>

            <div className="flex flex-col gap-4 mt-2 border-t border-white-700 pt-4 max-h-[400px] overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-gray-400 text-sm">No activity found.</p>
              ) : (
                activities.map((item: any) => (
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

          {/* RIGHT COLUMN: NOTIFICATIONS */}
          <div className="w-full bg-[#2c2c2c] border border-black rounded-xl p-5 flex flex-col gap-5">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Bell className="w-6 h-6 text-red-500" />
              Notifications
            </h2>
            <p className="text-sm text-gray-300">
              Important alerts and updates
            </p>

            <div className="flex flex-col gap-4 mt-2 border-t border-white-700 pt-4 max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-sm">No notifications available.</p>
              ) : (
                notifications.map((item: any) => (
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
