// src/pages/delete/success.tsx
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { CheckCircle } from "lucide-react";

export default function DeleteSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        <Header
          title="Delete Backup"
          subtitle="Backup removed"
          onLogout={() => navigate("/login")}
        />

        <div className="bg-[#2C2C2C] p-6 rounded-xl border border-black max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-800 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Backup Deleted</h3>
              <p className="text-gray-300 mt-1">
                The backup has been successfully deleted.
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate("/backup")} 
            className="w-full inline-flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-500 text-white px-4 py-3 rounded-md font-semibold">
              Back to backups
              </button>
          </div>
        </div>
      </main>
    </div>
  );
}
