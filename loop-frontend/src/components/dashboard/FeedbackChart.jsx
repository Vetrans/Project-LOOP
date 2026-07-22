import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { getFeedbackTrend } from "../../services/dashboardService";

export default function FeedbackChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await getFeedbackTrend();
      setData(response);
    };

    loadData();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1515] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Weekly Feedback Trend
        </h2>

        <p className="text-sm text-gray-400">
          Customer feedback received during the last 7 days.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="feedback" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />

            <XAxis dataKey="name" stroke="#94A3B8" />

            <YAxis stroke="#94A3B8" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="feedback"
              stroke="#22D3EE"
              strokeWidth={3}
              fill="url(#feedback)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}