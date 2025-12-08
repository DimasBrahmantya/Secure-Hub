import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function BackupProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = (location.state as any)?.id as string | undefined;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate("/backup");
      return;
    }

    let total = 0;
    const interval = setInterval(() => {
      total += Math.floor(Math.random() * 10) + 15;
      if (total > 100) total = 100;
      setProgress(total);
      if (total >= 100) {
        clearInterval(interval);
        // cukup kembali ke list — backend sudah membuat backup di /generate
        setTimeout(() => navigate("/backup"), 700);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [id, navigate]);

  if (!id) return null;

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        <Header title="Backup Progress" subtitle="Creating backup..." onLogout={() => navigate("/login")} />

        <div className="bg-[#2C2C2C] p-6 rounded-xl border border-black max-w-6xl">
          <p className="text-gray-300">Creating backup...</p>
          <div className="mt-6">
            <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
              <div style={{ width: `${progress}%` }} className="h-3 bg-teal-400 transition-all"></div>
            </div>
            <p className="mt-3 text-sm text-gray-300">{progress}%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
