export default function SectionWrapper({
  id,
  children,
  className = "",
}) {
  return (
    <section
      id={id}
      className={`py-32 ${className}`}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}