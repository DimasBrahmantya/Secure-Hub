import { useEffect, useState } from "react";

export default function BackupList() {
  const [backups, setBackups] = useState([]);

  const load = async () => {
    const res = await fetch("http://localhost:3000/backup");
    const data = await res.json();
    setBackups(data);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteBackup = async (id: string) => {
    await fetch(`http://localhost:3000/backup/${id}`, {
      method: "DELETE",
    });
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:3000/backup/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="bg-[#2C2C2C] border border-black rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white">Backup Records</h2>
      <p className="text-sm text-gray-400 mb-4">System-wide backup history</p>

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
          {backups.map((item: any) => (
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
    </div>
  );
}
