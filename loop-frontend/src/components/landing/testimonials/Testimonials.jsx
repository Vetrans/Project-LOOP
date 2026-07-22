import SectionWrapper from "../../common/SectionWrapper";
import SectionTitle from "../../common/SectionTitle";
import TestimonialCard from "./TestimonialCard";
import testimonials from "../../../data/testimonials";

export default function Testimonials() {
  return (
    <SectionWrapper id="testimonials">

      <SectionTitle
        eyebrow="TESTIMONIALS"
        title="Loved by Teams Around the World"
        description="See what our customers say about using LOOP to understand their users better."
        center
      />

      <div className="mt-20 grid gap-8 lg:grid-cols-3">
        {testimonials.map((item) => (
          <TestimonialCard
            key={item.name}
            {...item}
          />
        ))}
      </div>

    </SectionWrapper>
  );
}