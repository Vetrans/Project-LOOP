import SectionWrapper from "../../common/SectionWrapper";
import SectionTitle from "../../common/SectionTitle";
import FeatureCard from "./FeatureCard";
import features from "../../../data/features";

export default function Features() {
  return (
    <SectionWrapper id="features">

      <SectionTitle
        eyebrow="FEATURES"
        title="Everything You Need To Understand Customers"
        description="LOOP combines artificial intelligence, advanced analytics and collaboration tools into one beautiful platform."
        center
      />

      <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            {...feature}
          />
        ))}

      </div>

    </SectionWrapper>
  );
}