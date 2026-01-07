import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import UserRow from "../../components/UserRow";
import { Users, UserMinus, LogOut, UserPlus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/login");

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<UserItem | null>(null);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("User");
  const [newPassword, setNewPassword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ================== LOAD USERS ==================
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth`);
      if (!res.ok) throw new Error("Failed to load users");
      const data: UserItem[] = await res.json();
      setUsers(data || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ================== DELETE USER ==================
  const deleteUser = async () => {
    if (!confirmDelete) return;
    try {
      await fetch(`${API_URL}/auth/${confirmDelete}`, { method: "DELETE" });
      setUsers(users.filter((u) => u._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // ================== ADD USER ==================
  const addUser = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;

    try {
      const body = {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        status: "active",
      };

      await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await loadUsers();
      setShowAddUser(false);
      setNewName("");
      setNewEmail("");
      setNewRole("User");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  // ================== EDIT USER ==================
  const updateUser = async () => {
    if (!editUser) return;

    try {
      const body = {
        name: editUser.name,
        email: editUser.email,
        password: editUser.password,
        role: editUser.role,
        status: editUser.status,
      };

      await fetch(`${API_URL}/auth/${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await loadUsers();
      setEditUser(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 lg:ml-[296px]">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden bg-gray-900 text-white p-2 rounded-lg"
            >
              <Users className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-lg text-gray-700 hidden md:block">
                Manage user accounts and permissions
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <UserPlus className="w-6 h-6" />
              <span className="font-semibold hidden sm:block">Add User</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-semibold hidden sm:block">Logout</span>
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
            value={users
              .filter((u) => u.status === "inactive")
              .length.toString()}
            subtitle="Inactive accounts"
            icon={<UserMinus className="text-blue-500 w-10 h-10" />}
          />
        </div>

        {/* TABLE */}
        <table className="w-full mt-10 bg-[#2C2C2C] rounded-xl overflow-hidden border border-black">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow
                key={u._id}
                user={u}
                onDelete={() => setConfirmDelete(u._id)}
                onEdit={() => setEditUser(u)}
              />
            ))}
          </tbody>
        </table>

        {/* Popups */}
        {confirmDelete && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[#2c2c2c] p-6 rounded-xl shadow-2xl w-[350px]">
              <h2 className="text-xl font-semibold mb-3 text-white">
                Delete User?
              </h2>
              <p className="text-white mb-6">
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

        {showAddUser && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[#2c2c2c] p-6 rounded-xl shadow-2xl w-[350px]">
              <h2 className="text-xl font-semibold mb-3 text-white">
                Add New User
              </h2>
              <input
                placeholder="Name"
                className="w-full p-2 border rounded mb-3"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                placeholder="Email"
                className="w-full p-2 border rounded mb-3"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                placeholder="Password"
                className="w-full p-2 border rounded mb-3"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2 border rounded mb-4 bg-[#2c2c2c] text-white"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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

        {editUser && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[#2c2c2c] p-6 rounded-xl shadow-2xl w-[350px]">
              <h2 className="text-xl font-semibold mb-3 text-white">
                Edit User
              </h2>
              <input
                placeholder="Name"
                className="w-full p-2 border rounded mb-3"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="w-full p-2 border rounded mb-3"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
              <input
                placeholder="Password"
                type="password"
                className="w-full p-2 border rounded mb-3"
                value={editUser.password || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
              />
              <select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
                className="w-full p-2 border rounded mb-3 bg-[#2c2c2c] text-white"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              <select
                value={editUser.status}
                onChange={(e) =>
                  setEditUser({ ...editUser, status: e.target.value })
                }
                className="w-full p-2 border rounded mb-4 bg-[#2c2c2c] text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-3 py-1 rounded-lg bg-red-700 text-white hover:bg-red-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={updateUser}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
