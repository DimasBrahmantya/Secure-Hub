import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import {
  generateBackup,
  deleteBackup,
  getBackups,
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
  const [backupFile, setBackupFile] = useState<File | null>(null);

  // ===============================
  // LOAD BACKUPS FROM BACKEND
  // ===============================
  const load = async () => {
    const data = await getBackups();
    setBackups(data);
  };

  useEffect(() => {
    load();
  }, []);

  // ===============================
  // CREATE BACKUP
  // ===============================
  const handleCreateBackup = async (file: File) => {
    try {
      const result = await generateBackup(file);

      console.log("BACKUP RESULT:", result);

      if (!result?._id) {
        alert("Backup failed");
        return;
      }

      await load();

      navigate("/backup/progress", {
        state: { id: result._id },
      });
    } catch (err) {
      console.error("Backup error:", err);
      alert("Backup failed");
    }
  };

  // ===============================
  // DELETE BACKUP
  // ===============================
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

  // ===============================
  // STATS
  // ===============================
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

        {/* ===== STAT CARDS ===== */}
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

        {/* ===== CREATE BACKUP AREA ===== */}
        <div className="bg-[#2C2C2C] p-4 rounded-xl border border-black mb-6 mt-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-7 h-7 text-orange-500" />
            <div>
              <h2 className="text-2xl font-bold">Create New Backups</h2>
              <p className="text-white-600 mt-1">
                Create, restore, or delete backups
              </p>
            </div>
          </div>

          {/* === FILE INPUT UNTUK BACKUP === */}
          <label className="block">
            <p className="text-white text-sm mb-1">
              Upload Backup File (.zip):
            </p>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setBackupFile(e.target.files?.[0] || null)}
              className="text-white"
            />
          </label>

          {/* === BACKUP NOW === */}
          <button
            onClick={() => {
              if (!backupFile) {
                alert("Pilih file backup terlebih dahulu");
                return;
              }
              handleCreateBackup(backupFile);
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-500 text-white px-4 py-3 rounded-md font-semibold"
          >
            <UploadCloud className="w-5 h-5 text-blue-500" /> Backup Now
          </button>
        </div>

        {/* ===== BACKUP TABLE ===== */}
        <div className="bg-[#2C2C2C] p-4 rounded-xl border border-black">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700/60">
                <th className="py-3">Name</th>
                <th className="py-3">Size</th>
                <th className="py-3">Created</th>
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {backups.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-gray-400">
                    No backups yet. Create one using "Backup Now".
                  </td>
                </tr>
              )}

              {backups.map((b) => (
                <tr
                  key={b._id}
                  className="text-white border-b border-gray-700/40"
                >
                  <td className="py-3">{b.fileName}</td>
                  <td className="py-3">{(b.size / 1024).toFixed(2)} KB</td>
                  <td className="py-3 text-gray-300">
                    {formatAgo(b.createdAt)}
                  </td>
                  <td className="py-3 capitalize">{b.status}</td>

                  <td className="py-3 capitalize">
                    {b.status === "ready"}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate("/restore/progress", {
                            state: { id: b._id, fileName: b.fileName },
                          })
                        }
                        className="px-3 py-1 rounded bg-[#5CC8BA] text-white font-semibold"
                      >
                        Restore
                      </button>

                      <button
                        onClick={() => handleDelete(b._id)}
                        className="px-3 py-1 rounded bg-red-700 hover:bg-red-800 text-white"
                      >
                        <Trash2 className="w-4 h-4 inline-block" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== DELETE MODAL ===== */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#2c2c2c] p-6 rounded-lg w-full max-w-md shadow">
              <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
              <p className="text-sm text-whitw-700 mb-4">
                Are you sure you want to delete this backup? This action cannot
                be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
