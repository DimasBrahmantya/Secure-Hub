export default function ScanItem({ url, status, time }: { url: string; status: 'safe' | 'suspicious' | string; time: string }) {
  const color =
    status === "safe"
      ? "text-teal-400"
      : status === "suspicious"
      ? "text-yellow-400"
      : "text-red-500";

  return (
    <div className="bg-black/40 p-3 rounded-lg flex justify-between items-center border border-white/10">
      <div>
        <p className="text-white text-sm">{url}</p>
        <p className="text-gray-400 text-xs">{time}</p>
      </div>

      <span className={`font-semibold capitalize ${color}`}>{status}</span>
    </div>
  );
}
