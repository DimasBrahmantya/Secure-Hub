import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { restoreBackupByName } from "../../api/backup";
import { useBackupStore } from "../../store/backupStore";
import { Menu } from "lucide-react";

export default function RestoreProgress() {
  const location = useLocation();
  const navigate = useNavigate();

  const fileName = (location.state as any)?.fileName as string | undefined;
  const fetchBackups = useBackupStore((s) => s.fetchBackups);

  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!fileName) {
      navigate("/backup");
      return;
    }

    let total = 0;

    const interval = setInterval(() => {
      total += 20;

      if (total >= 100) {
        total = 100;
        clearInterval(interval);

        restoreBackupByName(fileName)
          .then(async () => {
            await fetchBackups();
            navigate("/restore/success", { state: { fileName } });
          })
          .catch((err) => {
            console.error("Restore failed:", err);
            navigate("/backup");
          });
      }

      setProgress(total);
    }, 400);

    return () => clearInterval(interval);
  }, [fileName, navigate, fetchBackups]);

  if (!fileName) return null;

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
          title="Restore"
          subtitle="Restoring backup..."
          onLogout={() => navigate("/login")}
        />

        <div className="bg-[#2C2C2C] p-6 rounded-xl border border-black max-w-6xl">
          <p className="text-gray-300">
            Restoring backup <b>{fileName}</b>… please wait
          </p>

          <div className="mt-6">
            <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
              <div
                className="h-3 bg-teal-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-300">{progress}%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
