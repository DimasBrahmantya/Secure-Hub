const BASE_URL = "http://localhost:3000";

export async function getBackups() {
  const res = await fetch(`${BASE_URL}/backup`);
  if (!res.ok) throw new Error("Failed fetch backups");
  return res.json();
}

export async function generateBackup(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/backup/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed generate backup");
  return res.json();
}


export async function deleteBackup(id: string) {
  const res = await fetch(`${BASE_URL}/backup/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed delete backup");
  return res.json();
}

/**
 * RESTORE = update status + download (backend handle)
 */
export async function restoreBackupByName(fileName: string) {
  const res = await fetch(`${BASE_URL}/backup/restore/${fileName}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed restore");
  return res.json();
}
