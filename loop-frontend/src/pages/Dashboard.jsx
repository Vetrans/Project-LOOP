import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";

import StatsGrid from "../components/dashboard/StatsGrid";
import FeedbackChart from "../components/dashboard/FeedbackChart";
import SentimentChart from "../components/dashboard/SentimentChart";
import TopThemes from "../components/dashboard/TopThemes";
import RecentFeedback from "../components/dashboard/RecentFeedback";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <PageContainer
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
      >
        <StatsGrid />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <FeedbackChart />
          <SentimentChart />
        </div>

        <div className="mt-8">
          <TopThemes />
        </div>

        <div className="mt-8">
          <RecentFeedback />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}