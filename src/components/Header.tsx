
interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex justify-between items-start mb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-lg text-gray-700">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
