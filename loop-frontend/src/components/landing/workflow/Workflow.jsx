import SectionWrapper from "../../common/SectionWrapper";
import SectionTitle from "../../common/SectionTitle";
import WorkflowStep from "./WorkflowStep";
import workflow from "../../../data/workflow";

export default function Workflow() {
  return (
    <SectionWrapper id="workflow">

      <SectionTitle
        eyebrow="WORKFLOW"
        title="How LOOP Turns Feedback Into Business Growth"
        description="Our AI-powered pipeline processes customer feedback from collection to actionable insights."
        center
      />

      <div className="mt-24 grid gap-16 lg:grid-cols-4">

        {workflow.map((step, index) => (
          <WorkflowStep
            key={step.title}
            {...step}
            index={index}
            isLast={index === workflow.length - 1}
          />
        ))}

      </div>

    </SectionWrapper>
  );
}