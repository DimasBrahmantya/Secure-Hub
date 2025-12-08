import { create } from "zustand";
// import { backupApi } from "../../api/backup";
import * as backupApi from "../api/backup";

export interface BackupItem {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  status: "ready" | "restoring" | "restored" | "deleted";
}

interface BackupStore {
  [x: string]: any;
  backups: BackupItem[];
  fetchBackups: () => Promise<void>;
  generate: () => Promise<BackupItem>;
  delete: (id: string) => Promise<void>;
  restore: (file: File) => Promise<any>;
  updateBackup: (id: string, patch: Partial<BackupItem>) => void;
}

export const useBackupStore = create<BackupStore>((set, get) => ({
  backups: [],

  fetchBackups: async () => {
    const data = await backupApi.getBackups();
    set({
      backups: data.map((x: any) => ({
        id: x._id,
        name: x.fileName,
        size: `${(x.size / 1024).toFixed(2)} KB`,
        createdAt: x.createdAt,
        status: "ready",
      })),
    });
  },

  generate: async () => {
    const data = await backupApi.generateBackup();

    const item: BackupItem = {
      id: data._id,
      name: data.fileName,
      size: `${(data.size / 1024).toFixed(2)} KB`,
      createdAt: data.createdAt,
      status: "ready",
    };

    set({ backups: [item, ...get().backups] });
    return item;
  },

  delete: async (id: string) => {
    await backupApi.deleteBackup(id);
    set({ backups: get().backups.filter((b) => b.id !== id) });
  },

  restore: async (file: File) => {
    return await backupApi.restoreBackup(file);
  },

  updateBackup: (id, patch) => {
    set({
      backups: get().backups.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });
  },
}));
