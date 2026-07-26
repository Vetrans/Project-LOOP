import api from "./api";

function buildParams({ startDate, endDate } = {}) {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return params;
}

export const getOverviewStats = async (range) => {
  const { data } = await api.get("/analytics/overview", { params: buildParams(range) });
  return data;
};

export const getFeedbackTrend = async (range) => {
  const { data } = await api.get("/analytics/trend", { params: buildParams(range) });
  return data;
};

export const getSentimentData = async (range) => {
  const { data } = await api.get("/analytics/sentiment", { params: buildParams(range) });
  return data;
};

export const getCategoryData = async (range) => {
  const { data } = await api.get("/analytics/categories", { params: buildParams(range) });
  return data;
};

export const getRatingDistribution = async (range) => {
  const { data } = await api.get("/analytics/ratings", { params: buildParams(range) });
  return data;
};

export const getAIInsights = async (range) => {
  const { data } = await api.get("/analytics/insights", { params: buildParams(range) });
  return data;
};

/*
=========================================
Real server-side PDF/Excel/CSV rendering isn't built yet — that's a
separate feature. Analytics.jsx already tells the user this plainly
("...will work after backend integration"), so this stays a no-op
rather than faking a success.
=========================================
*/
export const exportAnalytics = async (type) => {
  console.warn(`Analytics export to ${type} is not implemented yet.`);
  return false;
};