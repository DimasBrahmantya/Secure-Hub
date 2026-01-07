import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { CheckCircle, Menu } from "lucide-react";

export default function RestoreSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const fileName = (location.state as any)?.fileName as string | undefined;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!fileName) {
    navigate("/backup");
    return null;
  }

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
          title="Restore Completed"
          subtitle="Backup restored successfully"
          onLogout={() => navigate("/login")}
        />

        <div className="bg-[#2C2C2C] p-6 rounded-xl border border-black max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-900 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Restore Successful
              </h3>
              <p className="text-gray-300 mt-1">
                Backup <b>{fileName}</b> has been restored successfully.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/backup")}
              className="w-full inline-flex items-center justify-center gap-2
                bg-teal-400 hover:bg-teal-500
                text-white px-4 py-3 rounded-md font-semibold"
            >
              Back to Backup List
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
