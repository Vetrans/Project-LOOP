const stats = [
  {
    title: "Feedback",
    value: "24.8K",
    change: "+12%",
  },
  {
    title: "Positive",
    value: "87%",
    change: "+5%",
  },
  {
    title: "Issues Solved",
    value: "1,284",
    change: "+18%",
  },
  {
    title: "AI Accuracy",
    value: "98%",
    change: "+1.2%",
  },
];

export default function KPISection() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => (

        <div
          key={item.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#32E6A4]/40"
        >
          <p className="text-sm text-white/50">

            {item.title}

          </p>

          <h2 className="mt-3 text-3xl font-bold">

            {item.value}

          </h2>

          <span className="mt-4 inline-block rounded-full bg-[#32E6A4]/10 px-3 py-1 text-sm text-[#32E6A4]">

            {item.change}

          </span>

        </div>

      ))}

    </div>
  );
}