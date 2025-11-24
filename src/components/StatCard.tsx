import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}

export default function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-[#2C2C2C] border border-black rounded-lg p-4 flex justify-between items-center h-[117px]">
      {/* Teks di kiri */}
      <div className="flex flex-col justify-between h-full">
        <span className="text-sm font-medium text-[#F5F5F5]">{title}</span>
        <span className="text-2xl font-bold text-[#F5F5F5]">{value}</span>
        <span className="text-xs text-[#F5F5F5]">{subtitle}</span>
      </div>

      {/* Icon di kanan */}
      <div className="flex-shrink-0 ml-4">
        {icon}
      </div>
    </div>
  );
}
