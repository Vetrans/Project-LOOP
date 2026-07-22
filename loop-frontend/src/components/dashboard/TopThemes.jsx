import { useEffect, useState } from "react";
import { getTopThemes } from "../../services/dashboardService";
import { Tag } from "lucide-react";

export default function TopThemes() {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    const loadThemes = async () => {
      const data = await getTopThemes();
      setThemes(data);
    };

    loadThemes();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1515] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Top Feedback Themes
        </h2>

        <p className="text-sm text-gray-400">
          Most discussed customer topics this week.
        </p>
      </div>

      <div className="space-y-4">
        {themes.map((theme) => {
          const Icon = theme.icon || Tag;

          return (
            <div
              key={theme.title}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-[#141C1C] p-4 hover:border-cyan-400/40 transition"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-white/5 p-3">
                  <Icon className={theme.color} size={22} />
                </div>

                <div>
                  <h3 className="font-medium">{theme.title}</h3>

                  <p className="text-sm text-gray-400">
                    {theme.count} mentions
                  </p>
                </div>
              </div>

              <span
                className={`text-sm font-semibold ${
                  "text-cyan-400"
                }`}
              >
                {theme.change}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
