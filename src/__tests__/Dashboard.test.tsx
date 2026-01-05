import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";

/* =======================
   MOCK useNavigate
======================= */
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* =======================
   MOCK API DASHBOARD
======================= */
vi.mock("../../api/dashboard", () => ({
  getDashboardStats: vi.fn(),
  getDashboardOverview: vi.fn(),
  getDashboardActivity: vi.fn(),
}));

/* =======================
   MOCK CHILD COMPONENTS
======================= */
vi.mock("../../components/Sidebar", () => ({
  default: () => <div>Sidebar</div>,
}));

vi.mock("../../components/StatCard", () => ({
  default: ({ title }: any) => <div>{title}</div>,
}));

vi.mock("../../components/FeatureCard", () => ({
  default: ({ title }: any) => <div>{title}</div>,
}));

vi.mock("../../components/RecentActivity", () => ({
  default: () => <div>Recent Activity</div>,
}));

import {
  getDashboardStats,
  getDashboardOverview,
  getDashboardActivity,
} from "../api/dashboard";

/* =======================
   SETUP DUMMY DATA
======================= */
beforeEach(() => {
  vi.clearAllMocks();

  (getDashboardStats as any).mockResolvedValue([
    { title: "Security Status", value: "OK", subtitle: "All Secure" },
  ]);

  (getDashboardOverview as any).mockResolvedValue({
    phishing: { urlsAnalyzedToday: 12, threatsDetected: 3 },
    backup: { total: 4, storageUsed: "1.5 GB" },
    monitoring: { activeSessions: 2, pendingAlerts: 1 },
    admin: { totalUsers: 10, aiSensitivity: "High" },
  });

  (getDashboardActivity as any).mockResolvedValue([
    { time: "09:00", message: "User logged in" },
  ]);
});

/* =======================
   TEST CASES
======================= */
describe("Dashboard Page", () => {
  it("Menampilkan halaman dashboard", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Security Dashboard")
    ).toBeInTheDocument();
  });

  it("Memanggil API dashboard saat load", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getDashboardStats).toHaveBeenCalled();
      expect(getDashboardOverview).toHaveBeenCalled();
      expect(getDashboardActivity).toHaveBeenCalled();
    });
  });

  it("Menampilkan data statistik dari API", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(
      await screen.findByText("Security Status")
    ).toBeInTheDocument();
  });

  it("Logout mengarahkan ke halaman login", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
