import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { getSentimentData } from "../../services/dashboardService";

const COLORS = ["#22C55E", "#FACC15", "#EF4444"];

export default function SentimentChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await getSentimentData();
      setData(response);
    };

    loadData();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1515] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Sentiment Analysis
        </h2>

        <p className="text-sm text-gray-400">
          AI classification of customer feedback.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}