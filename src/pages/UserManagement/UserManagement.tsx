import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import UserRow from "../../components/UserRow";
import { Users, UserMinus, LogOut, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/login");

  const usersData = [
    { id: 1, name: "Dimas", role: "Admin", status: "active" },
    { id: 2, name: "Budi", role: "User", status: "active" },
    { id: 3, name: "Santi", role: "User", status: "inactive" },
  ];

  const [users, setUsers] = useState(usersData);

  // DELETE POPUP
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const deleteUser = () => {
    if (confirmDelete !== null) {
      setUsers((prev) => prev.filter((u) => u.id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  // ADD USER POPUP
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("User");

  const addUser = () => {
    if (newName.trim() === "") return;

    const newUser = {
      id: users.length + 1,
      name: newName,
      role: newRole,
      status: "active",
    };

    setUsers((prev) => [...prev, newUser]);
    setShowAddUser(false);
    setNewName("");
    setNewRole("User");
  };

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden relative">
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        <header className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-lg text-gray-700">
              Manage user accounts and permissions
            </p>
          </div>

          <div className="flex gap-3">
            {/* ADD USER */}
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <UserPlus className="w-6 h-6" />
              <span className="font-semibold">Add User</span>
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard
            title="Total Users"
            value={users.length.toString()}
            subtitle="All registered users"
            icon={<Users className="text-yellow-500 w-10 h-10" />}
          />
          <StatCard
            title="Active"
            value={users.filter((u) => u.status === "active").length.toString()}
            subtitle="Active accounts"
            icon={<Users className="text-yellow-500 w-10 h-10" />}
          />
          <StatCard
            title="Inactive"
            value={users.filter((u) => u.status === "inactive").length.toString()}
            subtitle="Inactive accounts"
            icon={<UserMinus className="text-blue-500 w-10 h-10" />}
          />
        </div>

        <table className="w-full mt-10 bg-[#2C2C2C] rounded-xl border border-black">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <UserRow
                key={u.id}
                id={u.id}
                name={u.name}
                role={u.role}
                status={u.status}
                onDelete={() => setConfirmDelete(u.id)}
              />
            ))}
          </tbody>
        </table>
      </main>

      {/* ===================== DELETE POPUP ===================== */}
      {confirmDelete !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[350px] animate-scaleIn">
            <h2 className="text-xl font-semibold mb-3">Delete User?</h2>

            <p className="text-gray-600 mb-6">
              Yakin ingin menghapus user dengan ID {confirmDelete}?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>

              <button
                onClick={deleteUser}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADD USER POPUP ===================== */}
      {showAddUser && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#2c2c2c] p-6 rounded-xl shadow-2xl w-[350px] animate-scaleIn">
            <h2 className="text-xl font-semibold mb-3">Add New User</h2>

            <label className="text-white-700 font-medium">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded mb-4 mt-1"
              placeholder="Enter user name"
            />

            <label className="text--700 font-medium">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-2 border rounded mb-6 mt-1 bg-[#2c2c2c] text-white"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 rounded-lg bg-red hover:bg-red-400 transition"
              >
                Cancel
              </button>

              <button
                onClick={addUser}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ANIMATIONS (NO GLOBAL.CSS) ===================== */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
