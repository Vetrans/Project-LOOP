import {
  overviewStats,
  feedbackTrend,
  sentimentData,
  categoryData,
  ratingDistribution,
  aiInsights,
} from "../data/analyticsData";

/*
=========================================
Analytics Service

Only this file will communicate
with the backend.

When backend is ready,
replace the mock functions
with axios API calls.

UI components won't change.
=========================================
*/

export const getOverviewStats = async () => {
  return overviewStats;
};

export const getFeedbackTrend = async () => {
  return feedbackTrend;
};

export const getSentimentData = async () => {
  return sentimentData;
};

export const getCategoryData = async () => {
  return categoryData;
};

export const getRatingDistribution = async () => {
  return ratingDistribution;
};

export const getAIInsights = async () => {
  return aiInsights;
};
/*
=========================================
Analytics Export

Future Backend API

GET /api/analytics/export?type=pdf
GET /api/analytics/export?type=excel
GET /api/analytics/export?type=csv
=========================================
*/

export const exportAnalytics = async (type) => {
  console.log("Export Analytics:", type);

  return true;
};