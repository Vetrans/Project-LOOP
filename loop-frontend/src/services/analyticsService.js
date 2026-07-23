import api from "./api";

export const getOverviewStats = async () => {
  const { data } = await api.get("/analytics/overview");
  return data;
};

export const getFeedbackTrend = async () => {
  const { data } = await api.get("/analytics/trend");
  return data;
};

export const getSentimentData = async () => {
  const { data } = await api.get("/analytics/sentiment");
  return data;
};

export const getCategoryData = async () => {
  const { data } = await api.get("/analytics/categories");
  return data;
};

export const getRatingDistribution = async () => {
  const { data } = await api.get("/analytics/ratings");
  return data;
};

export const getAIInsights = async () => {
  const { data } = await api.get("/analytics/insights");
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