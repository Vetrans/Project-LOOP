export default function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
}) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[4px] text-[#32E6A4]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/60">
          {description}
        </p>
      )}
    </div>
  );
}