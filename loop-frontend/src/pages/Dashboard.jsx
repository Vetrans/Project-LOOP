import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard, ErrorState, Skeleton } from "../components/ui";
import { VolumeChart, SentimentDonut, ThemesBarChart } from "../components/charts";
import { feedbackApi, themesApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([feedbackApi.stats(), themesApi.list()])
      .then(([statsRes, themesRes]) => {
        if (cancelled) return;
        setStats(statsRes.data);
        setThemes(themesRes.data.slice(0, 6).map((t) => ({ ...t, id: t._id })));
      })
      .catch((err) => !cancelled && setError(err?.response?.data?.message || "Couldn't load dashboard data."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="text-eyebrow">{user?.workspace?.name}</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">The shape of your feedback this period, at a glance.</p>
        </div>
      </header>

      {error && <ErrorState message={error} />}

      <div className="grid-stats">
        <StatCard label="Total feedback" value={loading ? "—" : (stats?.totalItems ?? 0).toLocaleString()} accent="violet" />
        <StatCard label="% negative" value={loading ? "—" : `${stats?.pctNegative ?? 0}%`} sub="All time" accent="coral" />
        <StatCard label="New this week" value={loading ? "—" : `+${stats?.newThisWeek ?? 0}`} sub="Last 7 days" accent="teal" />
      </div>

      <div className="grid-dashboard-charts section-gap">
        <div className="panel panel-pad">
          <div className="panel-header">
            <h2 className="panel-heading">Volume over time</h2>
            <span className="text-meta">weekly · last 8 weeks</span>
          </div>
          {loading ? <Skeleton style={{ height: 220, width: "100%" }} /> : <VolumeChart data={stats?.volume ?? []} />}
        </div>

        <div className="panel panel-pad">
          <div className="panel-header">
            <h2 className="panel-heading">Sentiment breakdown</h2>
          </div>
          {loading ? <Skeleton style={{ height: 220, width: "100%" }} /> : <SentimentDonut data={stats?.sentiment ?? []} />}
        </div>
      </div>

      <div className="panel panel-pad section-gap">
        <div className="panel-header">
          <h2 className="panel-heading">Top themes</h2>
          <Link to="/trends" className="link-quiet">
            View trends <ArrowUpRight size={13} />
          </Link>
        </div>
        {loading ? (
          <Skeleton style={{ height: 220, width: "100%" }} />
        ) : themes.length === 0 ? (
          <p className="panel-empty-note">No themes yet — add or import feedback to see it clustered here.</p>
        ) : (
          <ThemesBarChart data={themes} />
        )}
      </div>
    </div>
  );
}
