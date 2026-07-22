import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", value: 210 },
  { day: "Tue", value: 280 },
  { day: "Wed", value: 320 },
  { day: "Thu", value: 300 },
  { day: "Fri", value: 420 },
  { day: "Sat", value: 390 },
  { day: "Sun", value: 470 },
];

export default function WeeklyTrendChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

      <h3 className="mb-6 text-xl font-semibold">

        Weekly Feedback

      </h3>

      <div className="h-72">

        <ResponsiveContainer>

          <LineChart data={data}>

            <CartesianGrid strokeOpacity={0.1} />

            <XAxis dataKey="day" />

            <Tooltip />

            <Line
              dataKey="value"
              stroke="#32E6A4"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}