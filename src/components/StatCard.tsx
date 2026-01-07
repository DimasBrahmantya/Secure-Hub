import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <div
      className="
        bg-[#2C2C2C]
        border border-black
        rounded-xl
        p-4 sm:p-5
        flex flex-col sm:flex-row
        gap-3
      "
    >
      {/* TEXT */}
      <div className="flex flex-col gap-1">
        <span className="text-xs sm:text-sm font-medium text-[#F5F5F5]">
          {title}
        </span>

        <span className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">
          {value}
        </span>

        <span className="text-xs text-[#F5F5F5]/80 leading-snug">
          {subtitle}
        </span>
      </div>

      {/* ICON */}
      <div className="self-start sm:self-center">
        {icon}
      </div>
    </div>
  );
}
