import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "Positive",
    value: 82,
  },
  {
    name: "Neutral",
    value: 12,
  },
  {
    name: "Negative",
    value: 6,
  },
];

const COLORS = [
  "#32E6A4",
  "#FACC15",
  "#F87171",
];

export default function SentimentDonut() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold text-white">
          Sentiment
        </h3>

        <span className="text-sm text-white/50">
          Last 30 Days
        </span>

      </div>

      <div className="mt-4 h-[220px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={3}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-4 flex justify-center gap-6">

        {data.map((item, index) => (

          <div
            key={item.name}
            className="flex items-center gap-2"
          >

            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: COLORS[index],
              }}
            />

            <span className="text-sm text-white/70">
              {item.name}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}