import {
  Home,
  Shield,
  Database,
  TrendingUp,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", navigateTo: "/dashboard" },
    { icon: Shield, label: "Anti-Phishing", navigateTo: "/antiphishing" },
    { icon: Database, label: "Backup & Restore", navigateTo: "/backup" },
    { icon: TrendingUp, label: "Monitoring", navigateTo: "/monitoring" },
  ];

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen w-[296px] bg-[#2C2C2C]
          border border-black shadow-lg p-4 flex flex-col gap-4 z-50
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 p-3 h-[120px]">
          <svg
            className="w-12 h-12"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M24 44C24 44 40 36 40 24V10L24 4L8 10V24C8 36 24 44 24 44Z"
              stroke="#F5F5F5"
              strokeWidth="4"
            />
          </svg>
          <div>
            <span className="text-2xl font-bold text-white">SecureHub</span>
            <span className="text-sm text-white block -mt-1">
              Security Dashboard
            </span>
          </div>
        </div>

        {/* Main Menu */}
        <span className="text-xs text-white px-3">Main Menu</span>
        {menuItems.map((item, i) => {
          const active = location.pathname === item.navigateTo;
          return (
            <button
              key={i}
              onClick={() => {
                navigate(item.navigateTo);
                onClose();
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded
                ${active ? "bg-[#3C3C3C]" : "hover:bg-[#3C3C3C]"}
              `}
            >
              <item.icon className="w-6 h-6 text-white" />
              <span className="text-white">{item.label}</span>
            </button>
          );
        })}
      </aside>
    </>
  );
}
