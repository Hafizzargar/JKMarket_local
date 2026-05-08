export default function AdminStatsCard({ title, value, icon, trend, color = "emerald" }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend} <span className="text-slate-400 font-normal">from last month</span>
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
