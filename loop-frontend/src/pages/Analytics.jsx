import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";

import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsDateFilter from "../components/analytics/AnalyticsDateFilter";
import OverviewCards from "../components/analytics/OverviewCards";
import FeedbackTrendChart from "../components/analytics/FeedbackTrendChart";
import SentimentPieChart from "../components/analytics/SentimentPieChart";
import CategoryBarChart from "../components/analytics/CategoryBarChart";
import RatingDistribution from "../components/analytics/RatingDistribution";
import RecentInsights from "../components/analytics/RecentInsights";
import ExportAnalyticsModal from "../components/analytics/ExportAnalyticsModal";

import {
  getOverviewStats,
  getFeedbackTrend,
  getSentimentData,
  getCategoryData,
  getRatingDistribution,
  getAIInsights,
  exportAnalytics,
} from "../services/analyticsService";

const emptyRange = { startDate: "", endDate: "" };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Turns the raw { startDate, endDate } filter state into the phrase
// every chart subtitle drops in after "over ..." — this is what makes
// the charts visibly reflect the active filter, not just the data
// underneath them.
function describeRange({ startDate, endDate }) {
  if (!startDate && !endDate) return "the last 30 days";
  if (startDate && endDate) return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  if (startDate) return `${formatDate(startDate)} to today`;
  return `up to ${formatDate(endDate)}`;
}

export default function Analytics() {
  const [overview, setOverview] = useState([]);
  const [trend, setTrend] = useState([]);
  const [sentiment, setSentiment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [insights, setInsights] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(emptyRange);

  const rangeLabel = useMemo(() => describeRange(dateRange), [dateRange]);

  const loadAnalytics = async (range) => {
    setLoading(true);

    try {
      const [
        overviewData,
        trendData,
        sentimentData,
        categoryData,
        ratingData,
        insightData,
      ] = await Promise.all([
        getOverviewStats(range),
        getFeedbackTrend(range),
        getSentimentData(range),
        getCategoryData(range),
        getRatingDistribution(range),
        getAIInsights(range),
      ]);

      setOverview(overviewData);
      setTrend(trendData);
      setSentiment(sentimentData);
      setCategories(categoryData);
      setRatings(ratingData);
      setInsights(insightData);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reruns every chart whenever the date range changes — this, plus
  // the rangeLabel passed to each chart below, is the actual C5 fix:
  // charts now reflect the active date-range filter both in the data
  // they show and in the label describing what they're showing.
  useEffect(() => {
    loadAnalytics(dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      // Simulate backend delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      await loadAnalytics(dateRange);
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

        <AnalyticsDateFilter
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={setDateRange}
          loading={loading}
        />

        <OverviewCards stats={overview} comparisonLabel="vs previous period" />

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <FeedbackTrendChart data={trend} rangeLabel={rangeLabel} />
          <SentimentPieChart data={sentiment} rangeLabel={rangeLabel} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <CategoryBarChart data={categories} rangeLabel={rangeLabel} />
          <RatingDistribution data={ratings} rangeLabel={rangeLabel} />
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