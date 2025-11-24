import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Stat {
  label: string;
  value: string;
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  stats: Stat[];
  buttonText: string;
  navigateTo?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  stats,
  buttonText,
  navigateTo,
}: FeatureCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#2C2C2C] border border-black rounded-lg p-5 flex flex-col justify-between h-full">
      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="text-xl font-bold text-[#F5F5F5]">{title}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-[#F5F5F5] mb-3">{description}</p>

      {/* Stats */}
      <div className="flex flex-col gap-1 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between text-[#F5F5F5]">
            <span className="text-sm">{stat.label}</span>
            <span className="text-sm font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={() => navigateTo && navigate(navigateTo)}
        className="mt-auto w-full bg-[#5CC8BA] border border-[#F5F5F5] rounded-lg px-3 py-2 text-sm font-semibold text-[#F5F5F5] hover:bg-[#4DB8AA] transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}
