import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { CheckCircle, Menu } from "lucide-react";
import { useState } from "react";

export default function DeleteSuccess() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        <Header
          title="Delete Backup"
          subtitle="Backup removed"
          onLogout={() => navigate("/login")}
        />

        <div className="bg-[#2C2C2C] p-6 rounded-xl border border-black max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-800 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Backup Deleted
              </h3>
              <p className="text-gray-300 mt-1">
                The backup has been successfully deleted.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/backup")}
              className="w-full bg-teal-400 hover:bg-teal-500 text-white px-4 py-3 rounded-lg font-semibold"
            >
              Back to backups
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
