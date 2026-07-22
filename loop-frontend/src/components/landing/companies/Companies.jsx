import SectionWrapper from "../../common/SectionWrapper";
import CompanyLogo from "./CompanyLogo";

const companies = [
  "Microsoft",
  "Amazon",
  "Google",
  "Adobe",
  "Spotify",
  "Netflix",
  "Uber",
  "Airbnb",
];

export default function Companies() {
  return (
    <SectionWrapper className="pt-10">

      <div className="text-center">

        <p className="text-sm uppercase tracking-[4px] text-white/40">

          Trusted by innovative companies

        </p>

      </div>

      <div className="mt-12 overflow-hidden">

        <div
          className="
          flex
          w-max
          gap-6
          whitespace-nowrap
          animate-[marquee_22s_linear_infinite]
        "
        >

          {[...companies, ...companies].map((company, index) => (

            <CompanyLogo

              key={index}

              name={company}

            />

          ))}

        </div>

      </div>

    </SectionWrapper>
  );
}
