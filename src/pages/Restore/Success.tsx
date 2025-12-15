import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { restoreBackupByName } from "../../api/backup";
import { useBackupStore } from "../../store/backupStore";

export default function RestoreProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileName = (location.state as any)?.fileName as string | undefined;
  const fetchBackups = useBackupStore((s) => s.fetchBackups);

  const [progress, setProgress] = useState(0);

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

        // 🔥 RESTORE BENAR DI SINI
        restoreBackupByName(fileName)
          .then(async() => {
            await fetchBackups();
            navigate("/restore/success", { state: { fileName } });
          })
          .catch((err) => {
            console.error("Restore failed:", err);
            alert("Restore failed");
            navigate("/backup");
          });
      }

      setProgress(total);
    }, 400);

    return () => clearInterval(interval);
  }, [fileName, navigate]);

  return (
    <div className="flex w-screen min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-[296px] p-6">
        <Header
          title="Restore"
          subtitle="Restoring backup..."
          onLogout={function (): void {
            throw new Error("Function not implemented.");
          }}
        />

        <div className="bg-[#2C2C2C] p-6 rounded-xl">
          <p className="text-gray-300">Restoring backup... please wait</p>
          <div className="mt-6">
            <div className="w-full bg-gray-700 h-3 rounded-full">
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
