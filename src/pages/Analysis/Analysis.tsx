import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  ArrowLeft,
  CheckCircle,
  ShieldAlert,
  ShieldBan,
  Bug,
  Shield,
  LogOut,
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

  const [openBlock, setOpenBlock] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchResult = async () => {
    try {
      const res = await fetch(
        `${API_URL}/phishing/check?url=${encodeURIComponent(targetUrl)}`
      );
      if (!res.ok) throw new Error("Failed to fetch scan result");
      const data = await res.json();
      setIsSafe(data.status === "Safe");
    } catch (err) {
      console.error(err);
      setIsSafe(false);
    }
  };

  useEffect(() => {
    let total = 0;
    const interval = setInterval(() => {
      total += 20;
      setProgress(total);

      if (total >= 100) {
        clearInterval(interval);
        setDone(true);
        fetchResult();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [targetUrl]);

  const handleBlock = async () => {
    try {
      await fetch(`${API_URL}/phishing/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      blockURL(targetUrl);
      setOpenBlock(true);
    } catch {
      alert("Gagal memblokir URL");
    }
  };

  const handleReport = async () => {
    try {
      await fetch(`${API_URL}/phishing/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      reportURL(targetUrl);
      setOpenReport(true);
    } catch {
      alert("Gagal melaporkan URL");
    }
  };

  return (
    <div className="flex w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 lg:ml-[296px]">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden bg-gray-900 text-white p-2 rounded-lg"
            >
              <Shield className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                URL Analysis
              </h1>
              <p className="text-lg text-gray-700 hidden md:block">
                AI-powered security scan
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:opacity-80"
          >
            <LogOut className="w-6 h-6" />
            <span className="hidden sm:block font-semibold">Logout</span>
          </button>
        </header>

        <button
          onClick={() => navigate("/antiphishing")}
          className="flex items-center gap-1 mb-6 text-gray-900 hover:opacity-70"
        >
          <ArrowLeft /> Back
        </button>

        <div className="bg-[#2C2C2C] text-white rounded-xl p-6 border border-black w-full max-w-6xl">
          <p className="opacity-70 text-sm mb-1">Analyzing URL</p>
          <h2 className="font-semibold text-lg mb-4 break-all">{targetUrl}</h2>

          {!done && (
            <div className="bg-[#1D1D1D] rounded-lg p-5 border border-[#3A3A3A]">
              <div className="w-full bg-[#3A3A3A] h-3 rounded-full">
                <div
                  className="h-3 bg-[#5CC8BA] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm mt-3 opacity-80">Scanning… {progress}%</p>
            </div>
          )}

          {done && isSafe !== null && (
            <div className="bg-[#1D1D1D] rounded-lg p-5 border border-[#3A3A3A] flex flex-col gap-4">
              <div
                className={`border rounded-lg p-4 flex gap-3 ${
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
                    {isSafe
                      ? "Site Appears Safe"
                      : "Potentially Dangerous Site"}
                  </h3>
                  <p className="text-sm opacity-80">
                    Threat score: {isSafe ? "9/10" : "3/10"}
                  </p>
                </div>
              </div>

              {!isSafe && (
                <div className="flex gap-4">
                  <Button
                    onClick={handleBlock}
                    className="bg-red-600 hover:bg-red-700 text-white flex gap-2"
                  >
                    <ShieldBan className="w-5 h-5" /> Block
                  </Button>

                  <Button
                    onClick={handleReport}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white flex gap-2"
                  >
                    <Bug className="w-5 h-5" /> Report
                  </Button>
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
          )}
        </div>
      </main>

      {/* MODALS */}
      <Dialog open={openBlock} onOpenChange={setOpenBlock}>
        <DialogContent className="bg-[#1E1E1E] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex gap-2 items-center">
              <ShieldBan /> URL Blocked
            </DialogTitle>
            <DialogDescription>
              URL berhasil diblokir dari sistem.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpenBlock(false);
                navigate("/antiphishing");
              }}
            >
              OKE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openReport} onOpenChange={setOpenReport}>
        <DialogContent className="bg-[#1E1E1E] text-white">
          <DialogHeader>
            <DialogTitle className="text-yellow-400 flex gap-2 items-center">
              <Bug /> Report Submitted
            </DialogTitle>
            <DialogDescription>
              Terima kasih atas laporan kamu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpenReport(false);
                navigate("/antiphishing");
              }}
            >
              OKE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
