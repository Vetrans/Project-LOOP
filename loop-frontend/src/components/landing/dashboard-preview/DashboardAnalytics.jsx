import StatCard from "../hero/StatCard";
import SentimentDonut from "../hero/SentimentDonut";
import MiniTrendChart from "../hero/MiniTrendChart";
import AIInsight from "../hero/AIInsight";
import RecentFeedback from "../hero/RecentFeedback";

export default function DashboardAnalytics() {
  return (
    <div className="rounded-[36px] border border-white/10 bg-[#0E1515] p-8">

      {/* KPI */}
      <div className="grid gap-5 md:grid-cols-4">

        <StatCard
          title="Feedback"
          value="24.5K"
          change="+12%"
        />

        <StatCard
          title="Positive"
          value="82%"
          change="+5%"
        />

        <StatCard
          title="Accuracy"
          value="98%"
          change="+1%"
        />

        <StatCard
          title="Tickets"
          value="312"
          change="-8%"
        />

      </div>

      {/* Charts */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <SentimentDonut />

        <MiniTrendChart />

      </div>

      {/* AI */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <AIInsight />

        <RecentFeedback />

      </div>

    </div>
  );
}