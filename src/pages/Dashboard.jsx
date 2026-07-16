import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { StatCard } from "../components/ui";
import { VolumeChart, SentimentDonut, ThemesBarChart } from "../components/charts";
import { mockStats, mockVolume, mockSentiment, mockThemes } from "../lib/mockData";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Swap this effect for real calls (feedbackApi, themesApi) once the
  // backend is live — loading state and layout are already wired for it.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="label">{user?.workspace?.name}</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-mist-100">Dashboard</h1>
          <p className="mt-1 text-sm text-mist-400">
            The shape of your feedback this period, at a glance.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total feedback" value={mockStats.totalItems.toLocaleString()} accent="violet" />
        <StatCard
          label="% negative"
          value={`${mockStats.pctNegative}%`}
          sub="Last 30 days"
          accent="coral"
        />
        <StatCard
          label="New this week"
          value={`+${mockStats.newThisWeek}`}
          sub={`${mockStats.gaugeTrend > 0 ? "+" : ""}${mockStats.gaugeTrend}% vs last week`}
          accent="teal"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-mist-100">Volume over time</h2>
            <span className="font-mono text-[11px] text-mist-400">weekly</span>
          </div>
          {loading ? <ChartSkeleton /> : <VolumeChart data={mockVolume} />}
        </div>

        <div className="panel p-5">
          <h2 className="mb-2 font-display text-sm font-semibold text-mist-100">Sentiment breakdown</h2>
          {loading ? <ChartSkeleton /> : <SentimentDonut data={mockSentiment} />}
        </div>
      </div>

      <div className="mt-4 panel p-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-mist-100">Top themes</h2>
          <a href="/trends" className="flex items-center gap-1 text-xs text-loop-violet hover:underline">
            View trends <ArrowUpRight size={13} />
          </a>
        </div>
        {loading ? <ChartSkeleton /> : <ThemesBarChart data={mockThemes} />}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-56 w-full animate-pulse rounded-lg bg-ink-800" />;
}
