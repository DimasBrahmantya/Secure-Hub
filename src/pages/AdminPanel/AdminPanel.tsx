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
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
    const handleLogout = () => navigate("/login");

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
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

        {/* TOP 4 STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value="24"
            subtitle="Active accounts"
            icon={<Users className="w-10 h-10 text-yellow-500" />}
          />

          <StatCard
            title="System Health"
            value="2 hours ago"
            subtitle="Next backup in 22 hours"
            icon={<Server className="w-10 h-10 text-green-500" />}
          />

          <StatCard
            title="AI Sensitivity"
            value="High"
            subtitle="Detection level"
            icon={<Shield className="w-10 h-10 text-pink-500" />}
          />

          <StatCard
            title="Security Score"
            value="95"
            subtitle="Overall rating"
            icon={<Gauge className="w-10 h-10 text-red-500" />}
          />
        </div>

        {/* MIDDLE SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          
          {/* USER MANAGEMENT CARD */}
          <div className="bg-[#2c2c2c] border-black rounded-xl p-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <UserCog className="w-6 h-6 text-yellow-500" />
              User Management
            </h3>
            <p className="text-white-600 mt-1">
              Manage user accounts, roles, and permissions
            </p>

            <div className="flex justify-between mt-6 text-white-800">
              <div>
                <p className="text-sm">Active Users</p>
                <p className="font-semibold text-lg">24</p>
              </div>
              <div>
                <p className="text-sm">Admin Users</p>
                <p className="font-semibold text-lg">3</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/users")}
              className="w-full bg-teal-400 hover:bg-teal-500 mt-6 py-3 rounded-lg font-semibold text-white"
            >
              Manage Users
            </button>
          </div>

          {/* STATISTICS & REPORT CARD */}
          <div className="bg-[#2c2c2c] border-black rounded-xl p-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-green-500" />
              Statistics & Report
            </h3>
            <p className="text-white-600 mt-1">
              View detailed analytics and phishing reports
            </p>

            <div className="flex justify-between mt-6 text-white-800">
              <div>
                <p className="text-sm">Total Reports</p>
                <p className="font-semibold text-lg">1,247</p>
              </div>
              <div>
                <p className="text-sm">Threats Blocked</p>
                <p className="font-semibold text-lg">127</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/statistics")}
              className="w-full bg-teal-400 hover:bg-teal-500 mt-6 py-3 rounded-lg font-semibold text-white"
            >
              View Statistics
            </button>
          </div>
        </div>

        {/* RECENT ADMIN ACTION */}
        <div className="bg-[#2c2c2c] border-black rounded-xl p-6 mt-10">
          <h3 className="text-xl font-semibold text-white">
            Recent Administrative Action
          </h3>
          <p className="text-white-600 mt-1">
            Latest changes made by administrators
          </p>

          <div className="mt-6 flex flex-col gap-6">

            <div className="border-b border-gray-300 pb-4 flex justify-between">
              <div>
                <p className="font-semibold">User Role Updated</p>
                <p className="text-sm text-white-600">by admin@securehub.com</p>
              </div>
              <span className="text-white-500 text-sm">1 hour ago</span>
            </div>

            <div className="border-b border-gray-300 pb-4 flex justify-between">
              <div>
                <p className="font-semibold">AI Sensitivity Adjusted</p>
                <p className="text-sm text-white-600">by admin@securehub.com</p>
              </div>
              <span className="text-white-500 text-sm">3 hours ago</span>
            </div>

            <div className="border-b border-gray-300 pb-4 flex justify-between">
              <div>
                <p className="font-semibold">New User Added</p>
                <p className="text-sm text-white-600">by admin@securehub.com</p>
              </div>
              <span className="text-white-500 text-sm">1 day ago</span>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Backup Policy Updated</p>
                <p className="text-sm text-white-600">by admin@securehub.com</p>
              </div>
              <span className="text-white-500 text-sm">2 days ago</span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
