import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";

import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import OverviewCards from "../components/analytics/OverviewCards";
import FeedbackTrendChart from "../components/analytics/FeedbackTrendChart";
import SentimentPieChart from "../components/analytics/SentimentPieChart";
import CategoryBarChart from "../components/analytics/CategoryBarChart";
import RatingDistribution from "../components/analytics/RatingDistribution";
import RecentInsights from "../components/analytics/RecentInsights";
import ExportAnalyticsModal from "../components/analytics/ExportAnalyticsModal";
import { exportAnalytics } from "../services/analyticsService";

import {
  getOverviewStats,
  getFeedbackTrend,
  getSentimentData,
  getCategoryData,
  getRatingDistribution,
  getAIInsights,
} from "../services/analyticsService";

export default function Analytics() {
  const [overview, setOverview] = useState([]);
  const [trend, setTrend] = useState([]);
  const [sentiment, setSentiment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [insights, setInsights] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      const [
        overviewData,
        trendData,
        sentimentData,
        categoryData,
        ratingData,
        insightData,
      ] = await Promise.all([
        getOverviewStats(),
        getFeedbackTrend(),
        getSentimentData(),
        getCategoryData(),
        getRatingDistribution(),
        getAIInsights(),
      ]);

      setOverview(overviewData);
      setTrend(trendData);
      setSentiment(sentimentData);
      setCategories(categoryData);
      setRatings(ratingData);
      setInsights(insightData);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

 const handleRefresh = async () => {
  setRefreshing(true);

  try {
    // Simulate backend delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    await loadAnalytics();
  } finally {
    setRefreshing(false);
  }
};

 const handleExport = async (format) => {
  await exportAnalytics(format);

  setShowExportModal(false);

  alert(
    `${format.toUpperCase()} export will work after backend integration.`
  );
};

  return (
    <DashboardLayout>
      <PageContainer
        title="Analytics"
        subtitle="Analyze customer feedback with AI-powered insights."
      >
        <AnalyticsHeader
  onRefresh={handleRefresh}
  onExport={() => setShowExportModal(true)}
  refreshing={refreshing}
/>

        <OverviewCards stats={overview} />

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <FeedbackTrendChart data={trend} />
          <SentimentPieChart data={sentiment} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <CategoryBarChart data={categories} />
          <RatingDistribution data={ratings} />
        </div>

        <div className="mt-8">
  <RecentInsights insights={insights} />
</div>

<ExportAnalyticsModal
  isOpen={showExportModal}
  onClose={() => setShowExportModal(false)}
  onExport={handleExport}
/>

</PageContainer>
</DashboardLayout>
);
}