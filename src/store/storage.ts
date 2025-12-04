// src/store/storage.ts

export interface ScanData {
  url: string;
  status: "Safe" | "Danger" | "Warning";
  threat: string;
  time: string;
  blocked?: boolean;   // ditandai jika user block
  reported?: boolean;  // ditandai jika user report
}

/* =============================
    RECENT SCANS
============================= */

export const getRecentScans = (): ScanData[] => {
  const stored = localStorage.getItem("recent_scans");
  return stored ? JSON.parse(stored) : [];
};

export const saveRecentScans = (scans: ScanData[]) => {
  localStorage.setItem("recent_scans", JSON.stringify(scans));
};

export const updateScanStatus = (url: string, updates: Partial<ScanData>) => {
  const scans = getRecentScans();
  const idx = scans.findIndex((s) => s.url === url);

  if (idx !== -1) {
    scans[idx] = { ...scans[idx], ...updates };
    saveRecentScans(scans);
  }
};

/* =============================
    BLOCKLIST
============================= */

export const getBlocklist = (): string[] => {
  const stored = localStorage.getItem("blocked_urls");
  return stored ? JSON.parse(stored) : [];
};

export const blockURL = (url: string) => {
  const list = getBlocklist();

  if (!list.includes(url)) {
    const updated = [url, ...list];
    localStorage.setItem("blocked_urls", JSON.stringify(updated));
  }

  // Update juga di recent scans → tandai blocked
  updateScanStatus(url, { blocked: true });
};

export const isBlocked = (url: string): boolean => {
  return getBlocklist().includes(url);
};

export const unblockURL = (url: string) => {
  const list = getBlocklist().filter((item) => item !== url);
  localStorage.setItem("blocked_urls", JSON.stringify(list));

  updateScanStatus(url, { blocked: false });
};

/* =============================
    REPORT LIST
============================= */

export const getReportList = (): string[] => {
  const stored = localStorage.getItem("reported_urls");
  return stored ? JSON.parse(stored) : [];
};

export const reportURL = (url: string) => {
  const list = getReportList();

  if (!list.includes(url)) {
    const updated = [url, ...list];
    localStorage.setItem("reported_urls", JSON.stringify(updated));
  }

  // Update recent scans juga
  updateScanStatus(url, { reported: true });
};

export const isReported = (url: string): boolean => {
  return getReportList().includes(url);
};

