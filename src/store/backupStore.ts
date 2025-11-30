// src/store/backupStore.ts
import { create } from "zustand";

export interface BackupItem {
  id: string;
  name: string;
  size: string;
  createdAt: string; // ISO
  status: "ready" | "restoring" | "restored" |"deleted";
}

interface BackupStore {
  backups: BackupItem[];
  addBackup: (item: BackupItem) => void;
  removeBackup: (id: string) => void;
  updateBackup: (id: string, patch: Partial<BackupItem>) => void;
  reset: () => void;
}

const STORAGE_KEY = "securehub_backups_v1";

const loadFromStorage = (): BackupItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BackupItem[];
  } catch {
    return [];
  }
};

const saveToStorage = (data: BackupItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export const useBackupStore = create<BackupStore>((set, get) => {
  const initial = loadFromStorage();

  return {
    backups: initial,
    addBackup: (item) => {
      const next = [item, ...get().backups];
      saveToStorage(next);
      set({ backups: next });
    },
    removeBackup: (id) => {
      const next = get().backups.filter((b) => b.id !== id);
      saveToStorage(next);
      set({ backups: next });
    },
    updateBackup: (id, patch) => {
      const next = get().backups.map((b) => (b.id === id ? { ...b, ...patch } : b));
      saveToStorage(next);
      set({ backups: next });
    },
    reset: () => {
      saveToStorage([]);
      set({ backups: [] });
    },
  };
});
