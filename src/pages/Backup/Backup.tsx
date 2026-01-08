import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import { generateBackup, deleteBackup, getBackups } from "../../api/backup";
import { Trash2, UploadCloud, Database, Menu } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===============================
  // LOAD BACKUPS
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
      if (!result?._id) {
        alert("Backup failed");
        return;
      }

      await load();
      navigate("/backup/progress", { state: { id: result._id } });
    } catch (err) {
      console.error("Backup error:", err);
      alert("Backup failed");
    }
  };

  // ===============================
  // DELETE BACKUP
  // ===============================
  const handleDelete = (id: string) => setConfirmDeleteId(id);

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

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:ml-[296px]">
        {/* MOBILE MENU */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* HEADER */}
        <header className="flex justify-between items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Backup & Restore
            </h1>
            <p className="text-gray-700 hidden md:block text-sm">
              Manage data backups and recovery
            </p>
          </div>
        </header>

        {/* STAT CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            title="Total Backups"
            value={String(totalBackups)}
            subtitle="All stored backups"
            icon={<Database className="w-7 h-7 text-orange-500" />}
          />

          <StatCard
            title="Latest Backup Size"
            value={latestBackup}
            subtitle="Most recent file"
            icon={<UploadCloud className="w-7 h-7 text-blue-500" />}
          />

          <StatCard
            title="Ready Backups"
            value={String(totalBackups)}
            subtitle="Available to restore"
            icon={<Database className="w-7 h-7 text-orange-500" />}
          />

          <StatCard
            title="Backup Status"
            value="Active"
            subtitle="System operational"
            icon={<Database className="w-7 h-7 text-green-500" />}
          />
        </section>

        {/* CREATE BACKUP */}
        <section className="bg-[#2C2C2C] p-4 sm:p-6 rounded-xl border border-black mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Database className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Create New Backup
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm">
                Upload and manage backup files
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="block">
              <p className="text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">Upload Backup File (.zip)</p>
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setBackupFile(e.target.files?.[0] || null)}
                className="text-white w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-500 text-sm"
              />
            </label>

            <button
              onClick={() => {
                if (!backupFile) {
                  alert("Pilih file backup terlebih dahulu");
                  return;
                }
                handleCreateBackup(backupFile);
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              <UploadCloud className="w-4 sm:w-5 h-4 sm:h-5" />
              Backup Now
            </button>
          </div>
        </section>

        {/* BACKUP TABLE */}
        <section className="bg-[#2C2C2C] p-3 sm:p-4 rounded-xl border border-black overflow-x-auto">
          <table className="w-full text-left min-w-full sm:min-w-[720px] whitespace-nowrap text-sm sm:text-base">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700/60">
                <th className="py-2 sm:py-3">Name</th>
                <th className="py-2 sm:py-3">Size</th>
                <th className="py-2 sm:py-3">Created</th>
                <th className="py-2 sm:py-3">Status</th>
                <th className="py-2 sm:py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {backups.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 sm:py-6 text-gray-400 text-sm">
                    No backups yet.
                  </td>
                </tr>
              )}

              {backups.map((b) => (
                <tr
                  key={b._id}
                  className="text-white border-b border-gray-700/40"
                >
                  <td className="py-2 sm:py-3 text-xs sm:text-sm">{b.fileName}</td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm">{(b.size / 1024).toFixed(2)} KB</td>
                  <td className="py-2 sm:py-3 text-gray-300 text-xs sm:text-sm">
                    {formatAgo(b.createdAt)}
                  </td>
                  <td className="py-2 sm:py-3 capitalize text-xs sm:text-sm">{b.status}</td>
                  <td className="py-2 sm:py-3">
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() =>
                          navigate("/restore/progress", {
                            state: { id: b._id, fileName: b.fileName },
                          })
                        }
                        className="px-2 sm:px-3 py-1 rounded bg-teal-500 text-white font-semibold text-xs sm:text-sm whitespace-nowrap"
                      >
                        Restore
                      </button>

                      <button
                        onClick={() => handleDelete(b._id)}
                        className="px-2 sm:px-3 py-1 rounded bg-red-700 hover:bg-red-800 text-white flex-shrink-0"
                      >
                        <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* DELETE MODAL */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-[#2c2c2c] p-4 sm:p-6 rounded-lg w-full max-w-md">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white">
                Confirm Delete
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mb-4">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded border text-white text-sm sm:text-base"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-red-600 text-white text-sm sm:text-base"
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
