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

// Mirrors the palette in styles/variables.css — recharts renders to SVG
// outside the CSS cascade, so these live here as the single source of
// truth for chart color, kept in sync by hand with the design tokens.
const COLOR = {
  violet: "#8478F2",
  teal: "#43D6C0",
  coral: "#F97C86",
  amber: "#EEB25C",
  ink500: "#6C7288",
  hairline: "#232838",
  surfaceRaised: "#181C29",
  ink100: "#EEF0F7",
  ink300: "#9CA3B8",
};

const tooltipStyle = {
  background: COLOR.surfaceRaised,
  border: `1px solid ${COLOR.hairline}`,
  borderRadius: 10,
  fontSize: 12,
  fontFamily: "IBM Plex Mono, monospace",
  color: COLOR.ink100,
  boxShadow: "0 12px 28px -12px rgba(0,0,0,0.6)",
};
const legendTextStyle = { color: COLOR.ink300, fontSize: 12, fontFamily: "Inter, sans-serif" };

export function VolumeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLOR.violet} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COLOR.violet} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={COLOR.hairline} vertical={false} />
        <XAxis dataKey="date" stroke={COLOR.ink500} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke={COLOR.ink500} fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="volume" stroke={COLOR.violet} strokeWidth={2} fill="url(#volumeFill)" />
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
          formatter={(value) => <span style={legendTextStyle}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ThemesBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid stroke={COLOR.hairline} horizontal={false} />
        <XAxis type="number" stroke={COLOR.ink500} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          stroke={COLOR.ink300}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={140}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(132,120,242,0.08)" }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          {data.map((entry) => (
            <Cell key={entry.id} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const LINE_COLORS = [COLOR.coral, COLOR.amber, COLOR.teal, COLOR.violet];

export function ThemeTrendChart({ data, series }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={COLOR.hairline} vertical={false} />
        <XAxis dataKey="week" stroke={COLOR.ink500} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke={COLOR.ink500} fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={legendTextStyle}>{value}</span>} />
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
