import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import {
  ArrowLeft,
  CheckCircle,
  ShieldAlert,
  ShieldBan,
  Bug,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";

import { Button } from "../../components/ui/button";
import { blockURL, reportURL } from "../../store/storage";

export default function UrlAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const targetUrl = urlParams.get("url") ?? "";

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [isSafe, setIsSafe] = useState<boolean | null>(null);

  // MODALS
  const [openBlock, setOpenBlock] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  // API URL dari env
  const API_URL = import.meta.env.VITE_API_URL;

  // Ambil hasil scan dari backend
  const fetchResult = async () => {
    try {
      const res = await fetch(
        `${API_URL}/phishing/check?url=${encodeURIComponent(targetUrl)}`
      );
      if (!res.ok) throw new Error("Failed to fetch scan result");
      const data = await res.json();
      setIsSafe(data.status === "Safe");
    } catch (err) {
      console.error("Failed get scan result:", err);
      setIsSafe(false);
    }
  };

  // Simulasi scanning 0 → 100%
  useEffect(() => {
    let total = 0;
    const interval = setInterval(() => {
      total += 20;
      setProgress(total);

      if (total >= 100) {
        clearInterval(interval);
        setDone(true);
        fetchResult(); // Ambil hasil dari backend
      }
    }, 250);

    return () => clearInterval(interval);
  }, [targetUrl]);

  const handleBlock = async () => {
    try {
      const res = await fetch(`${API_URL}/phishing/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      if (!res.ok) throw new Error("Failed to block URL");

      blockURL(targetUrl); // simpan lokal
      setOpenBlock(true);
    } catch (err) {
      console.error(err);
      alert("Gagal memblokir URL");
    }
  };

  const handleReport = async () => {
    try {
      const res = await fetch(`${API_URL}/phishing/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      if (!res.ok) throw new Error("Failed to report URL");

      reportURL(targetUrl); // simpan lokal
      setOpenReport(true);
    } catch (err) {
      console.error(err);
      alert("Gagal melaporkan URL");
    }
  };

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-[296px] p-6 md:p-8 lg:p-10">
        <Header
          title="URL Analysis"
          subtitle="AI-powered security scan"
          onLogout={() => navigate("/login")}
        />

        <button
          onClick={() => navigate("/antiphishing")}
          className="flex items-center gap-1 mb-6 text-white hover:opacity-70"
        >
          <ArrowLeft /> Back
        </button>

        <div className="bg-[#2C2C2C] text-white rounded-xl p-6 border border-black w-full max-w-6xl">
          <p className="opacity-70 text-sm mb-1">Analyzing URL</p>
          <h2 className="font-semibold text-lg mb-4 break-all">{targetUrl}</h2>

          {!done && (
            <div className="bg-[#1D1D1D] rounded-lg p-5 border border-[#3A3A3A]">
              <div className="w-full bg-[#3A3A3A] h-3 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-[#5CC8BA] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm mt-3 opacity-80">
                Scanning for threats… {progress}%
              </p>
            </div>
          )}

          {done && isSafe !== null && (
            <div className="bg-[#1D1D1D] rounded-lg p-5 border border-[#3A3A3A] flex flex-col gap-4">
              <div
                className={`border rounded-lg p-4 flex items-start gap-3 ${
                  isSafe
                    ? "border-green-500 bg-green-900/20"
                    : "border-red-500 bg-red-900/20"
                }`}
              >
                {isSafe ? (
                  <CheckCircle className="text-green-400 w-6 h-6" />
                ) : (
                  <ShieldAlert className="text-red-400 w-6 h-6" />
                )}

                <div>
                  <h3 className="text-lg font-semibold">
                    {isSafe ? "Site Appears Safe" : "Potentially Dangerous Site"}
                  </h3>
                  <p className="text-sm opacity-80">
                    Threat score: {isSafe ? "9/10" : "3/10"}
                  </p>
                </div>
              </div>

              <div className="mt-1">
                <p className="text-sm font-semibold mb-2">Recommendations</p>
                {isSafe ? (
                  <ul className="text-sm ml-3 opacity-80 list-disc">
                    <li>Safe to access</li>
                    <li>No suspicious signatures detected</li>
                    <li>Verified SSL & normal traffic</li>
                  </ul>
                ) : (
                  <ul className="text-sm ml-3 opacity-80 list-disc">
                    <li>Do not input personal data</li>
                    <li>Website shows phishing patterns</li>
                    <li>Avoid login or form submissions</li>
                  </ul>
                )}
              </div>

              {!isSafe && (
                <div className="flex gap-4 mt-3">
                  <Button
                    variant="destructive"
                    onClick={handleBlock}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <ShieldBan className="w-5 h-5" /> Block Access
                  </Button>

                  <Button
                    onClick={handleReport}
                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Bug className="w-5 h-5" /> Report URL
                  </Button>
                </div>
              )}
            </div>
          )}

          {done && (
            <button
              onClick={() => navigate("/antiphishing")}
              className="w-full bg-[#5CC8BA] hover:bg-[#4DB8AA] text-white font-semibold py-3 rounded-lg mt-6"
            >
              Continue
            </button>
          )}
        </div>
      </main>

      {/* MODAL BLOCK */}
      <Dialog open={openBlock} onOpenChange={setOpenBlock}>
        <DialogContent className="bg-[#1E1E1E] text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex gap-2 items-center">
              <ShieldBan /> Block This URL?
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              URL ini terdeteksi sebagai situs berbahaya. Memblokirnya akan
              mencegah kamu mengaksesnya kembali dari sistem ini.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenBlock(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setOpenBlock(false)}
            >
              Block Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL REPORT */}
      <Dialog open={openReport} onOpenChange={setOpenReport}>
        <DialogContent className="bg-[#1E1E1E] text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-yellow-400 flex gap-2 items-center">
              <Bug /> Report Suspicious URL
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Laporkan URL ini kepada sistem kami agar dapat dianalisis lebih
              lanjut.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenReport(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => setOpenReport(false)}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
