// src/api/backup.ts

// Gunakan environment variable dari Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * GET BACKUPS
 */
export async function getBackups() {
  const res = await fetch(`${API_URL}/backup`);
  if (!res.ok) throw new Error("Failed fetch backups");
  return res.json();
}

/**
 * GENERATE BACKUP
 */
export async function generateBackup(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/backup/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed generate backup");
  return res.json();
}

/**
 * DELETE BACKUP
 */
export async function deleteBackup(id: string) {
  const res = await fetch(`${API_URL}/backup/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed delete backup");
  return res.json();
}

/**
 * RESTORE BACKUP
 */
export async function restoreBackupByName(fileName: string) {
  const res = await fetch(`${API_URL}/backup/restore/${fileName}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed restore");
  return res.json();
}
