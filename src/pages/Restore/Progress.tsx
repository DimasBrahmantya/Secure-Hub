import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { restoreBackupByName } from "../../api/backup";

export default function RestoreProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileName = (location.state as any)?.fileName as string | undefined;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!fileName) {
      navigate("/backup");
      return;
    }

    let total = 0;
    const interval = setInterval(() => {
      total += Math.floor(Math.random() * 12) + 15;

      if (total >= 100) {
        total = 100;
        setProgress(100);
        clearInterval(interval);

        (async () => {
          try {
            const res = await restoreBackupByName(fileName);

            if (res?.success) {
              navigate("/restore/success", { state: { fileName } });
            } else {
              throw new Error("Restore not successful");
            }
          } catch (err) {
            console.error("Restore error:", err);
            navigate("/backup"); // ❗ TANPA alert
          }
        })();
      } else {
        setProgress(total);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [fileName, navigate]);

  if (!fileName) return null;

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        <Header
          title="Restore"
          subtitle="Restoring backup..."
          onLogout={() => navigate("/login")}
        />

        <div className="bg-[#2C2C2C] p-6 rounded-xl border border-black max-w-6xl">
          <p className="text-gray-300">Restoring backup... please wait</p>

          <div className="mt-6">
            <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-3 bg-teal-400 transition-all"
              />
            </div>
            <p className="mt-3 text-sm text-gray-300">{progress}%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
