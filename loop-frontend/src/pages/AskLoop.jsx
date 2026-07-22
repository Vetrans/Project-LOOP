import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";
import ChatWindow from "../components/askloop/ChatWindow";

export default function AskLoop() {
  return (
    <DashboardLayout>
      <PageContainer
        title="Ask LOOP AI"
        subtitle="Analyze customer feedback using AI-powered insights."
      >
        <div className="mx-auto w-full max-w-7xl">
          <ChatWindow />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}