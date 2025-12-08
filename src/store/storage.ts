export interface ScanData {
  url: string;
  status: "Safe" | "Danger" | "Warning";
  threat: string;
  time: string;
  blocked?: boolean;
  reported?: boolean;
}

/* =============================
    RECENT SCANS
============================= */

export const getRecentScans = (): ScanData[] => {
  return JSON.parse(localStorage.getItem("recent_scans") || "[]");
};

export const saveRecentScans = (scans: ScanData[]) => {
  localStorage.setItem("recent_scans", JSON.stringify(scans));
};

/**
 * SIMPAN SCAN BARU
 * - Hapus yang lama jika URL sama
 * - Simpan paling atas
 */
export const addOrReplaceScan = (scan: ScanData) => {
  let scans = getRecentScans();

  // hapus yang lama kalau ada URL sama
  scans = scans.filter((s) => s.url !== scan.url);

  // masukkan baru di paling atas
  const updated = [scan, ...scans];

  saveRecentScans(updated);
};


/**
 * UPDATE STATUS BLOCK/REPORT
 */
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
  return JSON.parse(localStorage.getItem("blocked_urls") || "[]");
};

export const blockURL = (url: string) => {
  const list = getBlocklist();

  if (!list.includes(url)) {
    const updated = [url, ...list];
    localStorage.setItem("blocked_urls", JSON.stringify(updated));
  }

  // update recent scans
  updateScanStatus(url, { blocked: true });
};

export const unblockURL = (url: string) => {
  const list = getBlocklist().filter((item) => item !== url);
  localStorage.setItem("blocked_urls", JSON.stringify(list));

  updateScanStatus(url, { blocked: false });
};

export const isBlocked = (url: string) => getBlocklist().includes(url);


/* =============================
    REPORT LIST
============================= */

export const getReportList = (): string[] => {
  return JSON.parse(localStorage.getItem("reported_urls") || "[]");
};

export const reportURL = (url: string) => {
  const list = getReportList();

  if (!list.includes(url)) {
    const updated = [url, ...list];
    localStorage.setItem("reported_urls", JSON.stringify(updated));
  }

  updateScanStatus(url, { reported: true });
};

export const isReported = (url: string) => getReportList().includes(url);
