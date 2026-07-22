import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Positive", value: 72 },
  { name: "Neutral", value: 18 },
  { name: "Negative", value: 10 },
];

const colors = ["#32E6A4", "#FACC15", "#F87171"];

export default function SentimentChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

      <h3 className="mb-6 text-xl font-semibold">

        Sentiment Analysis

      </h3>

      <div className="h-72">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={colors[index]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}