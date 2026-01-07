import "./styles/globals.css";
//import { Toaster } from "./components/ui/sonner";
//import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Login } from "./pages/Login/Login";
import TwoFactorAuth from "./pages/2FA/TwoFactorAuth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
import AntiPhishing from "./pages/AntiPhishing/AntiPhising";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import UrlAnalysis from "./pages/Analysis/Analysis";
import BackupIndex from "./pages/Backup/Backup";
import BackupProgress from "./pages/Backup/Progress";
import RestoreProgress from "./pages/Restore/Progress";
import RestoreSuccess from "./pages/Restore/Success";
import DeleteSuccess from "./pages/Delete/Success";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import UserManagement from "./pages/UserManagement/UserManagement";
import Statistics from "./pages/Statistics&Reports/Statistics";
import Monitoring from "./pages/Monitoring & Notification/Monitoring";


const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <Toaster position="bottom-right" richColors/>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/2fa" element={<TwoFactorAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/antiphishing" element={<AntiPhishing/>}/>
          <Route path="/analysis" element={<UrlAnalysis/>}/>
          <Route path="/backup" element={<BackupIndex />} />
          <Route path="/backup/progress" element={<BackupProgress />} />
          <Route path="/restore/progress" element={<RestoreProgress />} />
          <Route path="/restore/success" element={<RestoreSuccess />} />
          <Route path="/delete/success" element={<DeleteSuccess />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
