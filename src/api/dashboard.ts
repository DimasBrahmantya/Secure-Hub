const BASE_URL = "http://localhost:3000";

// GET STATISTIK DASHBOARD
export async function getDashboardStats() {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    return res.json();
}

// GET ACTIVITY LOG
export async function getDashboardActivity() {
    const res = await fetch(`${BASE_URL}/dashboard/activity`);
    return res.json();
}