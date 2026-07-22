export default function BackgroundGlow() {
  return (
    <>
      <div className="absolute left-[-120px] top-24 h-[420px] w-[420px] rounded-full bg-[#32E6A4]/10 blur-[140px]" />

      <div className="absolute right-[-180px] top-56 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[160px]" />

      <div className="absolute bottom-[-220px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[180px]" />
    </>
  );
}