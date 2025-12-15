import { Clock } from "lucide-react";

type ActivityItem = {
  time: string | Date;
  description?: string;
};

type RecentActivityProps = {
  activity: ActivityItem[];
};

export default function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <section className="bg-[#2c2c2c] rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Recent Activity
      </h2>

      {activity.length === 0 ? (
        <p className="text-white">No activity available</p>
      ) : (
        <ul className="space-y-4">
          {activity.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 border-b pb-3 last:border-b-0"
            >
              <Clock className="w-5 h-5 text-blue-600 mt-1" />

              <div>
                <p className="text-sm text-white">
                  {item.time ? new Date(item.time).toLocaleString() : "Unknown"}
                </p>

                <p className="text-white font-medium mt-1">
                  {item.description || "No description"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
