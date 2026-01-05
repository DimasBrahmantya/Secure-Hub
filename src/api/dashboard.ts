// src/api/dashboard.ts

// Gunakan environment variable dari Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * GET DASHBOARD STATISTICS
 */
export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/dashboard/stats`);
  if (!res.ok) throw new Error("Failed fetch dashboard stats");
  return res.json();
}

/**
 * GET DASHBOARD ACTIVITY LOG
 */
export async function getDashboardActivity() {
  const res = await fetch(`${API_URL}/dashboard/activity`);
  if (!res.ok) throw new Error("Failed fetch dashboard activity");
  return res.json();
}

/**
 * GET DASHBOARD OVERVIEW
 */
export const getDashboardOverview = async () => {
  const res = await fetch(`${API_URL}/dashboard/overview`);
  if (!res.ok) throw new Error("Failed fetch dashboard overview");
  return res.json();
};
