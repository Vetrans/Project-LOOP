import SectionWrapper from "../../common/SectionWrapper";
import SectionTitle from "../../common/SectionTitle";
import FAQItem from "./FAQItem";
import faq from "../../../data/faq";

export default function FAQ() {
  return (
    <SectionWrapper
      id="faq"
      className="bg-[#050B0B]"
    >
      <SectionTitle
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Everything you need to know before getting started with LOOP."
        center
      />

      <div className="mx-auto mt-20 max-w-4xl space-y-6">
        {faq.map((item) => (
          <FAQItem
            key={item.question}
            {...item}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}