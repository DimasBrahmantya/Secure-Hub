
interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
}

export default function NotificationItem({ title, message, time }: NotificationItemProps) {
  return (
    <div className="bg-[#2C2C2C] p-4 rounded-lg border border-white flex justify-between items-start">
      <div>
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-gray-300 text-sm mt-1">{message}</p>
      </div>
      <div className="flex flex-col items-end">

        <span className="text-xs text-gray-400 mt-1">{time}</span>
      </div>
    </div>
  );
}
