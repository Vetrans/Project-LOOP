import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", feedback: 180 },
  { day: "Tue", feedback: 240 },
  { day: "Wed", feedback: 210 },
  { day: "Thu", feedback: 310 },
  { day: "Fri", feedback: 350 },
  { day: "Sat", feedback: 330 },
  { day: "Sun", feedback: 410 },
];

export default function MiniTrendChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold text-white">
          Weekly Trend
        </h3>

        <span className="rounded-full bg-[#32E6A4]/10 px-3 py-1 text-xs text-[#32E6A4]">
          +18%
        </span>

      </div>

      <div className="mt-5 h-[180px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid
              strokeOpacity={0.08}
            />

            <XAxis
              dataKey="day"
              tick={{
                fill: "#9CA3AF",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="feedback"
              stroke="#32E6A4"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}