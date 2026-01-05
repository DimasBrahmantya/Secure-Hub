import { Trash2, Pencil } from "lucide-react";

export default function UserRow({ user, onDelete, onEdit }: any) {
  const statusClass =
    user.status === "active"
      ? "bg-green-900 text-green-300 border border-green-400/40"
      : "bg-red-900 text-red-300 border border-red-400/40";

  return (
    <tr className="border-b border-gray-700 text-gray-200 rounded-lg">
      <td className="p-3">{user.id}</td>
      <td className="p-3">{user.name}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.role}</td>

      <td className="p-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {user.status === "active" ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="p-3 flex gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 rounded-lg bg-blue-700 text-white border-blue-400/40 
          hover:bg-blue-800 transition inline-flex items-center gap-2 text-sm"
        >
          <Pencil className="w-4 h-4" /> Edit
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1 rounded-lg bg-red-700 text-white border-red-400/40 
          hover:bg-red-800 transition inline-flex items-center gap-2 text-sm"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </td>
    </tr>
  );
}

