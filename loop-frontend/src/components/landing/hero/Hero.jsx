import HeroContent from "./HeroContent";
import HeroDashboard from "./HeroDashboard";
import BackgroundGlow from "./BackgroundGlow";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050B0B] pt-36 pb-24">

      <BackgroundGlow />

      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-20 px-6 lg:flex-row lg:items-center lg:justify-between">

        <HeroContent />

        <HeroDashboard />

      </div>

    </section>
  );
}