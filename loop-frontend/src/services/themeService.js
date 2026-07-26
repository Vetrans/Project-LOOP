import api from "./api";

export async function getThemes() {
  const { data } = await api.get("/themes");
  return data; // [{ _id, name, color, count }, ...]
}

export async function getThemeTrends(weeks = 8) {
  const { data } = await api.get("/themes/trends", { params: { weeks } });
  return data; // { series: [{ themeName, themeColor, week, count }], spikes: [{ name, trendPct, latestCount }] }
}