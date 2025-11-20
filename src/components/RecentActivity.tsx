import { CheckCircle, AlertTriangle, Clock, Shield } from "lucide-react";

interface ActivityItem {
  icon: React.ReactNode;
  iconColor: string;
  message: string;
  time: string;
}

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      icon: <CheckCircle className="w-6 h-6" strokeWidth={2.5} />,
      iconColor: "text-[#5CC8BA]",
      message: "Backup completed successfully",
      time: "2 hours ago",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      iconColor: "text-[#FFCD0F]",
      message: "Suspicious URL detected and blocked",
      time: "3 hours ago",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      iconColor: "text-[#8578CE]",
      message: "System scan completed",
      time: "5 hours ago",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      iconColor: "text-[#A90303]",
      message: "Security policy updated",
      time: "1 day ago",
    },
  ];

  return (
    <div className="bg-[#2C2C2C] border border-black rounded-lg p-2.5 flex flex-col gap-5">
      <h2 className="text-xl font-bold text-[#F5F5F5]">Recent Activity</h2>
      <p className="text-lg text-[#F5F5F5]">
        Latest security events and system updates
      </p>

      <div className="flex flex-col gap-5">
        {activities.map((activity, index) => (
          <div key={index}>
            <div className="flex items-start gap-5 flex-wrap">
              <div className={activity.iconColor}>{activity.icon}</div>
              <div className="flex-1">
                <p className="text-lg font-medium text-[#F5F5F5]">
                  {activity.message}
                </p>
                <p className="text-lg font-light text-[#F5F5F5] mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
            {index < activities.length - 1 && (
              <div className="w-full h-px bg-[#F5F5F5] mt-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
