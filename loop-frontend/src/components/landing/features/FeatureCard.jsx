export default function FeatureCard({
  icon: Icon,
  title,
  description,
  stat,
}) {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-[28px]
      border
      border-white/10
      bg-[#101817]
      p-8
      transition-all
      duration-500
      hover:-translate-y-2
      hover:border-[#32E6A4]/40
    "
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-gradient-to-br from-[#32E6A4]/10 via-transparent to-transparent" />

      <div className="relative">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#32E6A4]/15 text-[#32E6A4]">

          <Icon size={28} />

        </div>

        <h3 className="mt-8 text-2xl font-bold">

          {title}

        </h3>

        <p className="mt-4 leading-7 text-white/60">

          {description}

        </p>

        <div className="mt-8 inline-flex rounded-full border border-[#32E6A4]/30 bg-[#32E6A4]/10 px-4 py-2 text-sm font-medium text-[#32E6A4]">

          {stat}

        </div>

      </div>
    </div>
  );
}