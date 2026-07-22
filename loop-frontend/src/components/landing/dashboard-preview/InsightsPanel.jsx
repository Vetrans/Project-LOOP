const insights = [
  "Delivery complaints increased by 18% this week.",
  "Positive sentiment is highest among mobile users.",
  "Feature requests for dark mode are trending.",
];

export default function InsightsPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

      <h3 className="text-xl font-semibold">

        🤖 AI Insights

      </h3>

      <div className="mt-6 space-y-4">

        {insights.map((item) => (
          <div
            key={item}
            className="rounded-xl bg-white/5 p-4"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}