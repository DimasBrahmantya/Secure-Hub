import { create } from "zustand";
import * as backupApi from "../api/backup";

interface BackupItem {
  _id: string;
  fileName: string;
  size: number;
  createdAt: string;
  status?: "ready" | "restored";
}

interface BackupStore {
  backups: BackupItem[];
  fetchBackups: () => Promise<void>;
  restoreByName: (fileName: string) => Promise<void>;
}

export const useBackupStore = create<BackupStore>((set) => ({
  backups: [],

  fetchBackups: async () => {
    const data = await backupApi.getBackups();
    set({ backups: data });
  },

  restoreByName: async (fileName: string) => {
    await backupApi.restoreBackupByName(fileName);

    set((state) => ({
      backups: state.backups.map((b) =>
        b.fileName === fileName
          ? { ...b, status: "restored" }
          : b
      ),
    }));
  },
}));

