interface UserRowProps {
  id: number;
  name: string;
  role: string;
  status: string;
  onDelete: () => void;
}

export default function UserRow({ id, name, role, status, onDelete }: UserRowProps) {
  return (
    <tr className="border-b border-gray-700">
      <td className="p-3 text-white">{id}</td>
      <td className="p-3 text-white">{name}</td>
      <td className="p-3 text-white">{role}</td>
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded-md text-sm ${
            status === "active"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="p-3">
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-white text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
