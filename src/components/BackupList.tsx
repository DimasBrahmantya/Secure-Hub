import { useEffect, useState } from "react";

// Gunakan environment variable dari Vite
const API_URL = import.meta.env.VITE_API_URL;

export default function BackupList() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fungsi load backup
  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/backup`);
      if (!res.ok) throw new Error("Failed to fetch backups");
      const data = await res.json();
      setBackups(data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat backup. Cek console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Fungsi delete backup
  const deleteBackup = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/backup/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete backup");
      load();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus backup");
    }
  };

  // Fungsi update status backup
  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/backup/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      load();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status backup");
    }
  };

  return (
    <div className="bg-[#2C2C2C] border border-black rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white">Backup Records</h2>
      <p className="text-sm text-gray-400 mb-4">System-wide backup history</p>

      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : (
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-2">Name</th>
              <th>Size</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {backups.map((item) => (
              <tr key={item._id} className="border-b border-gray-700">
                <td className="py-2">{item.name}</td>
                <td>{item.size}</td>
                <td className="capitalize">{item.status}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>

                <td className="flex gap-3 py-2">
                  <button
                    onClick={() => updateStatus(item._id, "restoring")}
                    className="text-yellow-400 text-xs underline"
                  >
                    Restore
                  </button>

                  <button
                    onClick={() => deleteBackup(item._id)}
                    className="text-red-400 text-xs underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
