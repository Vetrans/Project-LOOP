import SectionWrapper from "../../common/SectionWrapper";
import SectionTitle from "../../common/SectionTitle";

import KPISection from "./KPISection";
import SentimentChart from "./SentimentChart";
import WeeklyTrendChart from "./WeeklyTrendChart";
import InsightsPanel from "./InsightsPanel";
import RecentFeedback from "./RecentFeedback";


export default function DashboardPreview() {
  return (
    <SectionWrapper id="dashboard">

      <SectionTitle
        eyebrow="DASHBOARD"
        title="Experience LOOP in Action"
        description="A powerful dashboard that transforms customer feedback into AI-powered business intelligence."
        center
      />

      <div className="mt-20 rounded-[36px] border border-white/10 bg-[#0E1515] p-8 shadow-2xl">

        <KPISection />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          <SentimentChart />

          <WeeklyTrendChart />

        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          <InsightsPanel />

          <RecentFeedback />

        </div>

      </div>

    </SectionWrapper>
  );
}