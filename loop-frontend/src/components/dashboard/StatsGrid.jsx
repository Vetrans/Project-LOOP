import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import { MessageSquare } from "lucide-react";

export default function StatsGrid() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };

    loadStats();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon || MessageSquare;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-[#0E1515] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{item.title}</p>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-green-400">
                  {item.change} this month
                </p>
              </div>

              <div className="rounded-xl bg-cyan-500/20 p-3">
                <Icon className="text-cyan-400" size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
