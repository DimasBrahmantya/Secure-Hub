const BASE_URL = "http://localhost:3000";

export async function getBackups() {
    const res = await fetch(`${BASE_URL}/backup`);
    if (!res.ok) throw new Error("Failed fetch backups");
    return res.json();
}

export async function generateBackup() {
    const res = await fetch(`${BASE_URL}/backup/generate`, {
        method: "POST",
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

export async function restoreBackup(file: File) {
    // jika frontend mengirim file binary (upload restore), gunakan FormData
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${BASE_URL}/backup/restore`, {
        method: "POST",
        body: fd,
    });
    if (!res.ok) throw new Error("Failed restore (upload)");
    return res.json();
}

// jika restore dipanggil hanya dengan fileName (string)
export async function restoreBackupByName(fileName: string) {
    const res = await fetch(`${BASE_URL}/backup/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
    });
    if (!res.ok) throw new Error("Failed restore by name");
    return res.json();
}

