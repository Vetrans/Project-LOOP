import StatCard from "./StatCard";
import SentimentDonut from "./SentimentDonut";


export default function HeroDashboard() {
  return (
    <div
      className="
      w-full
      max-w-[560px]
      rounded-[36px]
      border
      border-white/10
      bg-[#0E1515]
      p-8
      shadow-2xl
    "
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-white/50">
            Feedback Overview
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Dashboard
          </h2>

        </div>

        <div className="rounded-full bg-[#32E6A4]/10 px-4 py-2 text-[#32E6A4]">
          +18.2%
        </div>

      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">

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

      </div>

       <div className="mt-8">
        <SentimentDonut />
       </div>

      <div className="mt-6 rounded-2xl bg-[#32E6A4]/10 p-5">

        <h4 className="font-semibold text-[#32E6A4]">

          🤖 AI Insight

        </h4>

        <p className="mt-3 text-sm leading-7 text-white/70">

          Customer satisfaction increased by
          18% this week while checkout-related
          complaints decreased significantly.

        </p>

      </div>

    </div>
  );
}