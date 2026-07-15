import { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ThemeTrendChart } from "../components/charts";
import { mockThemes, mockThemeTrend, mockFeedback } from "../lib/mockData";
import { EmptyState } from "../components/ui";

export default function Trends() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-mist-100">Theme trends</h1>
        <p className="mt-1 text-sm text-mist-400">
          What's growing, what's fading, and which themes need attention this week.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="mb-3 font-display text-sm font-semibold text-mist-100">All themes</h2>
          <ul className="flex flex-col gap-1.5">
            {mockThemes.map((theme) => (
              <li key={theme.id}>
                <button
                  onClick={() => setSelected(theme)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                    selected?.id === theme.id ? "bg-loop-violet/15" : "hover:bg-ink-800"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: theme.color }} />
                    <span className="text-sm text-mist-100">{theme.name}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-mist-400">{theme.count}</span>
                    <span
                      className={`flex items-center gap-0.5 font-mono text-xs ${
                        theme.trend >= 0 ? "text-loop-coral" : "text-loop-teal"
                      }`}
                    >
                      {theme.trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(theme.trend)}%
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5 lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-mist-100">Volume vs. previous period</h2>
            <span className="font-mono text-[11px] text-mist-400">6-week view</span>
          </div>
          <ThemeTrendChart
            data={mockThemeTrend}
            series={["Onboarding friction", "Billing & invoices", "SSO / security"]}
          />
        </div>
      </div>

      <div className="mt-4 panel p-5">
        <h2 className="mb-3 font-display text-sm font-semibold text-mist-100">
          {selected ? `Feedback tagged “${selected.name}”` : "Select a theme to drill in"}
        </h2>
        {!selected ? (
          <EmptyState
            title="No theme selected"
            description="Click any theme on the left to see the real feedback items behind the number."
          />
        ) : (
          <DrillDown theme={selected} />
        )}
      </div>
    </div>
  );
}

function DrillDown({ theme }) {
  const items = mockFeedback.filter((f) => f.themes.includes(theme.name));
  if (items.length === 0) {
    return <EmptyState title="No sample items in this demo dataset" description="This theme is seeded with more items in the real database." />;
  }
  return (
    <ul className="flex flex-col divide-y divide-ink-800">
      {items.map((f) => (
        <li key={f.id} className="py-3 first:pt-0 last:pb-0">
          <p className="text-sm text-mist-100">{f.content}</p>
          <p className="mt-1 font-mono text-xs text-mist-400">
            {f.channel} · {f.customerLabel}
          </p>
        </li>
      ))}
    </ul>
  );
}
