import { LogOut } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onLogout: () => void;   // ⬅ WAJIB ADA
}

export default function Header({ title, subtitle, onLogout }: HeaderProps) {
  return (
    <header className="flex justify-between items-start mb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-lg text-gray-700">{subtitle}</p>
        )}
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80 transition"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </header>
  );
}
