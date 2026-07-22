import SectionWrapper from "../../common/SectionWrapper";
import SectionTitle from "../../common/SectionTitle";
import PricingCard from "./PricingCard";
import pricing from "../../../data/pricing";

export default function Pricing() {
  return (
    <SectionWrapper id="pricing">
      <SectionTitle
        eyebrow="PRICING"
        title="Simple Pricing for Every Team"
        description="Choose the plan that fits your business. Upgrade anytime as you grow."
        center
      />

      <div className="mt-20 grid gap-8 lg:grid-cols-3">
        {pricing.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>
    </SectionWrapper>
  );
}