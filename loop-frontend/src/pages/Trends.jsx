import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";

import ThemesHeader from "../components/trends/ThemesHeader";
import ThemeTrendChart from "../components/trends/ThemeTrendChart";
import ThemeCard from "../components/trends/ThemeCard";
import ThemeDrilldownModal from "../components/trends/ThemeDrilldownModal";

import { getThemes, getThemeTrends } from "../services/themeService";

export default function Trends() {
  const [themes, setThemes] = useState([]);
  const [series, setSeries] = useState([]);
  const [spikes, setSpikes] = useState([]);
  const [weeks, setWeeks] = useState(8);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const loadData = async (weeksParam = weeks) => {
    setLoading(true);
    try {
      const [themesData, trendsData] = await Promise.all([
        getThemes(),
        getThemeTrends(weeksParam),
      ]);
      setThemes(themesData);
      setSeries(trendsData.series || []);
      setSpikes(trendsData.spikes || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load theme trends.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(weeks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks]);

  // Merge each theme's spike % (from /themes/trends, keyed by name) into
  // the theme list (from /themes, which has the running total count) —
  // AI2 acceptance criteria #2: "flags themes spiking vs. the previous period."
  const themesWithTrend = useMemo(() => {
    const spikeMap = new Map(spikes.map((s) => [s.name, s.trendPct]));
    return themes
      .map((t) => ({ ...t, trendPct: spikeMap.get(t.name) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [themes, spikes]);

  const notableSpikes = useMemo(
    () => themesWithTrend.filter((t) => Math.abs(t.trendPct) >= 20),
    [themesWithTrend],
  );

  return (
    <DashboardLayout>
      <PageContainer>
        <ThemesHeader
          weeks={weeks}
          onWeeksChange={setWeeks}
          onRefresh={() => loadData(weeks)}
          loading={loading}
        />

        {notableSpikes.length > 0 && (
          <div className="mb-8 rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5">
            <p className="mb-2 text-sm font-semibold text-purple-400">
              ⚡ Notable spikes this period
            </p>
            <div className="flex flex-wrap gap-2">
              {notableSpikes.map((t) => (
                <button
                  key={t._id}
                  onClick={() => setSelectedTheme(t)}
                  className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-200 transition hover:bg-purple-500/20"
                >
                  {t.name} ({t.trendPct > 0 ? "+" : ""}{t.trendPct}%)
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <ThemeTrendChart series={series} />
        </div>

        <h2 className="mb-4 text-lg font-semibold text-white">All Themes</h2>

        {loading ? (
          <div className="py-16 text-center text-gray-400">Loading themes...</div>
        ) : themesWithTrend.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#111827] py-16 text-center text-gray-400">
            No themes yet — themes are created automatically as feedback gets classified.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themesWithTrend.map((theme, index) => (
              <ThemeCard
                key={theme._id}
                theme={theme}
                index={index}
                onSelect={setSelectedTheme}
              />
            ))}
          </div>
        )}

        <ThemeDrilldownModal
          theme={selectedTheme}
          onClose={() => setSelectedTheme(null)}
        />
      </PageContainer>
    </DashboardLayout>
  );
}