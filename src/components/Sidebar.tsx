import { Home, Shield, Database, TrendingUp, Settings, Users, BarChart3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", navigateTo: "/dashboard" },
    { icon: Shield, label: "Anti-Phishing", navigateTo: "/antiphishing" },
    { icon: Database, label: "Backup & Restore", navigateTo: "/backup" },
    { icon: TrendingUp, label: "Monitoring", navigateTo: "/monitoring" },
  ];

  const adminItems = [
    { icon: Settings, label: "Admin Panel", navigateTo: "/admin" },
    { icon: Users, label: "User Management", navigateTo: "/users" },
    { icon: BarChart3, label: "Statistics", navigateTo: "/statistics" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[296px] bg-[#2C2C2C] border border-black shadow-lg p-4 flex flex-col gap-4 z-50">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-3 h-[120px]">
        <svg
          className="w-12 h-12 flex-shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 44C24 44 40 36 40 24V10L24 4L8 10V24C8 36 24 44 24 44Z"
            stroke="#F5F5F5"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-[#F5F5F5]">SecureHub</span>
          <span className="text-sm text-[#F5F5F5] -mt-1">Security Dashboard</span>
        </div>
      </div>

      {/* Main Menu Label */}
      <div className="px-3 py-1">
        <span className="text-xs font-medium text-[#F5F5F5]">Main Menu</span>
      </div>

      {/* Main Menu Items */}
      <div className="flex flex-col gap-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.navigateTo;

          return (
            <button
              key={index}
              onClick={() => navigate(item.navigateTo)}
              className={`
                group relative flex items-center gap-3 px-4 py-2 rounded transition-all
                hover:bg-[#3C3C3C] active:scale-[0.97]
                ${isActive ? "bg-[#3C3C3C]" : ""}
              `}
            >
              {/* Left animated bar */}
              <span
                className={`
                  absolute left-0 top-0 h-full w-1 rounded-r-full bg-blue-400
                  transition-all duration-300
                  ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                `}
              ></span>

              <item.icon
                className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
                strokeWidth={2}
              />
              <span className="text-sm font-medium text-white">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Admin Label */}
      <div className="px-3 py-1 mt-4">
        <span className="text-xs font-medium text-[#F5F5F5]">Administration</span>
      </div>

      {/* Admin Items */}
      <div className="flex flex-col gap-1">
        {adminItems.map((item, index) => {
          const isActive = location.pathname === item.navigateTo;

          return (
            <button
              key={index}
              onClick={() => navigate(item.navigateTo)}
              className="
                group relative flex items-center gap-3 px-4 py-2 rounded 
                hover:bg-[#3C3C3C] transition-all active:scale-[0.97]
              "
            >
              <span
                className={`
                  absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r-full
                  transition-all duration-300
                  ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                `}
              ></span>

              <item.icon
                className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
                strokeWidth={2}
              />
              <span className="text-sm font-medium text-white">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
