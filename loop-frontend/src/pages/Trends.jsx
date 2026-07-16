import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ThemeTrendChart } from "../components/charts";
import { themesApi, feedbackApi } from "../lib/api";
import { EmptyState, ErrorState, Skeleton } from "../components/ui";

export default function Trends() {
  const [themes, setThemes] = useState([]);
  const [trendData, setTrendData] = useState({ series: [], spikes: [] });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([themesApi.list(), themesApi.trends({ weeks: 6 })])
      .then(([themesRes, trendsRes]) => {
        if (cancelled) return;
        setThemes(themesRes.data);
        setTrendData(trendsRes.data);
      })
      .catch((err) => !cancelled && setError(err?.response?.data?.message || "Couldn't load trends."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo(() => {
    const weeks = [...new Set(trendData.series.map((r) => String(r.week)))].sort();
    return weeks.map((week) => {
      const row = { week: formatWeek(week) };
      for (const r of trendData.series) {
        if (String(r.week) === week) row[r.themeName] = r.count;
      }
      return row;
    });
  }, [trendData]);

  const topThemeNames = useMemo(
    () => [...themes].sort((a, b) => b.count - a.count).slice(0, 4).map((t) => t.name),
    [themes]
  );

  const trendPctByName = useMemo(
    () => Object.fromEntries(trendData.spikes.map((s) => [s.name, s.trendPct])),
    [trendData]
  );

  return (
    <div>
      <header style={{ marginBottom: 24 }}>
        <h1 className="page-title">Theme trends</h1>
        <p className="page-subtitle">What's growing, what's fading, and which themes need attention this week.</p>
      </header>

      {error && <ErrorState message={error} />}

      <div className="grid-trends">
        <div className="panel panel-pad">
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--mist-100)", marginBottom: 12 }}>All themes</h2>
          {loading ? (
            <div className="stack gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} style={{ height: 40, width: "100%" }} />
              ))}
            </div>
          ) : themes.length === 0 ? (
            <EmptyState title="No themes yet" description="Themes appear automatically once feedback is classified." />
          ) : (
            <ul className="stack gap-1">
              {themes.map((theme) => {
                const trend = trendPctByName[theme.name] ?? 0;
                const isSelected = selected?._id === theme._id;
                return (
                  <li key={theme._id}>
                    <button
                      onClick={() => setSelected(theme)}
                      className="row-between"
                      style={{
                        width: "100%",
                        background: isSelected ? "var(--violet-wash)" : "transparent",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 12px",
                        textAlign: "left",
                      }}
                    >
                      <span className="row gap-2">
                        <span style={{ width: 8, height: 8, borderRadius: 999, background: theme.color, display: "inline-block" }} />
                        <span style={{ fontSize: 14, color: "var(--mist-100)" }}>{theme.name}</span>
                      </span>
                      <span className="row gap-3">
                        <span className="u-mono u-muted" style={{ fontSize: 12 }}>
                          {theme.count}
                        </span>
                        <span
                          className="row gap-1 u-mono"
                          style={{ fontSize: 12, color: trend >= 0 ? "var(--coral)" : "var(--teal)" }}
                        >
                          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(trend)}%
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="panel panel-pad">
          <div className="row-between" style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--mist-100)" }}>Volume vs. previous period</h2>
            <span className="u-mono u-muted" style={{ fontSize: 11 }}>
              6-week view
            </span>
          </div>
          {loading ? (
            <Skeleton style={{ height: 256, width: "100%" }} />
          ) : chartData.length === 0 ? (
            <EmptyState title="Not enough data yet" description="Trend lines appear once feedback spans a few weeks." />
          ) : (
            <ThemeTrendChart data={chartData} series={topThemeNames} />
          )}
        </div>
      </div>

      <div className="panel panel-pad" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--mist-100)", marginBottom: 12 }}>
          {selected ? `Feedback tagged "${selected.name}"` : "Select a theme to drill in"}
        </h2>
        {!selected ? (
          <EmptyState
            title="No theme selected"
            description="Click any theme on the left to see the real feedback items behind the number."
          />
        ) : (
          <DrillDown themeId={selected._id} />
        )}
      </div>
    </div>
  );
}

function formatWeek(week) {
  const date = new Date(week);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  return week;
}

function DrillDown({ themeId }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    feedbackApi
      .list({ theme: themeId, limit: 10 })
      .then((res) => !cancelled && setItems(res.data.items))
      .catch((err) => !cancelled && setError(err?.response?.data?.message || "Couldn't load feedback."));
    return () => {
      cancelled = true;
    };
  }, [themeId]);

  if (error) return <ErrorState message={error} />;
  if (!items) {
    return (
      <div className="stack gap-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} style={{ height: 48, width: "100%" }} />
        ))}
      </div>
    );
  }
  if (items.length === 0) {
    return <EmptyState title="No feedback tagged with this theme yet" />;
  }
  return (
    <ul>
      {items.map((f, i) => (
        <li key={f._id} style={{ padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid var(--ink-800)" }}>
          <p style={{ fontSize: 14, color: "var(--mist-100)" }}>{f.content}</p>
          <p className="u-mono u-muted" style={{ fontSize: 12, marginTop: 4 }}>
            {f.channel} · {f.customerLabel}
          </p>
        </li>
      ))}
    </ul>
  );
}
