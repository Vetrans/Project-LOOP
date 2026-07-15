import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

const tooltipStyle = {
  background: "#161C2C",
  border: "1px solid #2A3349",
  borderRadius: 10,
  fontSize: 12,
  fontFamily: "IBM Plex Mono, monospace",
  color: "#E4E8F1",
};

export function VolumeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C6FF0" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#7C6FF0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1F273A" vertical={false} />
        <XAxis dataKey="date" stroke="#6B7690" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#6B7690" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="volume" stroke="#7C6FF0" strokeWidth={2} fill="url(#volumeFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SentimentDonut({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          height={28}
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: "#8B96AD", fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ThemesBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid stroke="#1F273A" horizontal={false} />
        <XAxis type="number" stroke="#6B7690" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#8B96AD"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={140}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(124,111,240,0.08)" }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          {data.map((entry) => (
            <Cell key={entry.id} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const LINE_COLORS = ["#FB7185", "#F5B043", "#2DD9B9", "#7C6FF0"];

export function ThemeTrendChart({ data, series }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#1F273A" vertical={false} />
        <XAxis dataKey="week" stroke="#6B7690" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#6B7690" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: "#8B96AD", fontSize: 12 }}>{value}</span>}
        />
        {series.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={LINE_COLORS[i % LINE_COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
