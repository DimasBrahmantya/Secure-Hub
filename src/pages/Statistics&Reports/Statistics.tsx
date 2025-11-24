import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { LogOut } from "lucide-react";

export default function Statistics() {
    const navigate = useNavigate();
    const handleLogout = () => navigate("/login");
  return (
    <div className="flex w-screen min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10 text-black">
        {/* ===== HEADER ===== */}
        <header className="flex justify-between items-start mb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold">Statistics & Reports</h1>
                <p className="text-black-300 mt-2">Detailed analytics and phishing detection reports</p>
            </div>
            <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
        </header>

        {/* ===== TOP 3 STAT CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Scans */}
          <div className="bg-[#2c2c2c] p-6 rounded-xl border border-black-700 flex flex-col">
            <div className="text-white mb-2">Total Scans</div>
            <div className="text-white text-3xl font-bold">24,589</div>
            <p className="text-white mt-2">All time</p>
          </div>

          {/* Threats Detected */}
          <div className="bg-[#2c2c2c] p-6 rounded-xl border border-black-700 flex flex-col">
            <div className="text-white mb-2">Threats Detected</div>
            <div className="text-white text-3xl font-bold">1,359</div>
            <p className="text-white mt-2">Total malicious URLs</p>
          </div>

          {/* Success Rate */}
          <div className="bg-[#2c2c2c] p-6 rounded-xl border border-black-700 flex flex-col">
            <div className="text-white mb-2">Success Rate</div>
            <div className="text-white text-3xl font-bold">98.32%</div>
            <p className="text-white mt-2">Model performance</p>
          </div>
        </div>

        {/* ===== 2 MAIN PANELS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* LEFT PANEL — Threat Categories */}
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Top Threat Categories
            </h3>

            {/* Phishing */}
            <div className="mb-4">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Phishing (42%)</span>
                <span>920</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-blue-400 rounded" style={{ width: "42%" }}></div>
              </div>
            </div>

            {/* Malware */}
            <div className="mb-4">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Malware Detection (28%)</span>
                <span>620</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-red-400 rounded" style={{ width: "28%" }}></div>
              </div>
            </div>

            {/* Suspicious Domains */}
            <div className="mb-4">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Suspicious Domains (17%)</span>
                <span>370</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-yellow-400 rounded" style={{ width: "17%" }}></div>
              </div>
            </div>

            {/* Fake Login Pages */}
            <div className="mb-4">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Fake Login Pages (11%)</span>
                <span>180</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-purple-400 rounded" style={{ width: "11%" }}></div>
              </div>
            </div>

            {/* URL Spoofing */}
            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>URL Spoofing (7%)</span>
                <span>130</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-green-400 rounded" style={{ width: "7%" }}></div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — Detection Performance */}
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Detection Performance
            </h3>

            {/* Accuracy */}
            <div className="mb-5">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Accuracy</span>
                <span>97.6%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-blue-400 rounded" style={{ width: "97.6%" }}></div>
              </div>
            </div>

            {/* Precision */}
            <div className="mb-5">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Precision</span>
                <span>95.4%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-yellow-400 rounded" style={{ width: "95.4%" }}></div>
              </div>
            </div>

            {/* Recall */}
            <div className="mb-5">
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Recall</span>
                <span>93.1%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-red-400 rounded" style={{ width: "93.1%" }}></div>
              </div>
            </div>

            {/* False Positive Rate */}
            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>False Positive Rate</span>
                <span>1.8%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded">
                <div className="h-full bg-purple-400 rounded" style={{ width: "1.8%" }}></div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-6">
              Model metrics are updated daily based on new dataset inputs and classification outputs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
