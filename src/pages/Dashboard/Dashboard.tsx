import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";

import {
  getBackups,
  generateBackup,
  deleteBackup,
  restoreBackup,
} from "../../api/backup";

import { Trash2, UploadCloud, Database } from "lucide-react";

function formatAgo(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

export default function BackupIndex() {
  const navigate = useNavigate();

  const [backups, setBackups] = useState<any[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = async () => {
    const data = await getBackups();
    setBackups(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateBackup = async () => {
    const result = await generateBackup();
    await load();
    navigate("/backup/progress", { state: { id: result._id } });
  };

  const handleRestore = async (file: File) => {
    await restoreBackup(file);
    alert("Database restored!");
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    await deleteBackup(confirmDeleteId);
    await load();

    setConfirmDeleteId(null);
    navigate("/delete/success");
  };

  const totalBackups = backups.length;
  const latestBackup = backups[0]?.size
    ? `${(backups[0].size / 1024).toFixed(2)} KB`
    : "0 KB";
  const readyCount = totalBackups;

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        <Header
          title="Backup & Restore"
          subtitle="Manage data backups"
          onLogout={() => navigate("/login")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <StatCard
            title="Total Backups"
            value={String(totalBackups)}
            subtitle="All stored backups"
            icon={<Database className="w-10 h-10 text-orange-500" />}
          />

          <StatCard
            title="Latest Backup Size"
            value={latestBackup}
            subtitle="Most recent file"
            icon={<UploadCloud className="w-10 h-10 text-blue-500" />}
          />

          <StatCard
            title="Ready Backups"
            value={String(readyCount)}
            subtitle="Available to restore"
            icon={<Database className="w-10 h-10 text-orange-500" />}
          />
        </div>

        <div className="bg-[#2C2C2C] p-4 rounded-xl border border-black mb-6 mt-10 flex flex-col gap-4">
          <button
            onClick={handleCreateBackup}
            className="w-full inline-flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-500 text-white px-4 py-3 rounded-md font-semibold"
          >
            <UploadCloud className="w-5 h-5 text-blue-500" /> Backup Now
          </button>

          <label className="block">
            <p className="text-white text-sm mt-2">Restore Database:</p>
            <input
              type="file"
              onChange={(e) => handleRestore(e.target.files![0])}
              className="text-white"
            />
          </label>
        </div>

        <div className="bg-[#2C2C2C] p-4 rounded-xl border border-black">
          <table className="w-full text-left">
            <tbody>
              {backups.map((b) => (
                <tr key={b._id} className="text-white">
                  <td className="py-3">{b.fileName}</td>
                  <td className="py-3">
                    {(b.size / 1024).toFixed(2)} KB
                  </td>
                  <td className="py-3">{formatAgo(b.createdAt)}</td>
                  <td className="py-3">
                    <a
                      href={`http://localhost:3000/backup/download/${b.fileName}`}
                      className="px-3 py-1 rounded bg-[#5CC8BA] text-white"
                    >
                      Download
                    </a>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="px-3 py-1 rounded bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 inline-block" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
