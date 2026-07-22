import {
  BrainCircuit,
  MessageSquareText,
  BarChart3,
  BellRing,
  Users,
  Bot,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Theme Detection",
    description:
      "Automatically groups thousands of customer comments into meaningful themes.",
    stat: "98% Accuracy",
  },
  {
    icon: MessageSquareText,
    title: "Sentiment Analysis",
    description:
      "Detect positive, neutral and negative feedback instantly using AI.",
    stat: "Real-time",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Interactive charts that reveal trends, customer satisfaction and engagement.",
    stat: "12 Charts",
  },
  {
    icon: Bot,
    title: "Ask LOOP AI",
    description:
      "Ask natural language questions and receive AI-generated insights.",
    stat: "<2 sec",
  },
  {
    icon: BellRing,
    title: "Smart Alerts",
    description:
      "Receive alerts whenever customer sentiment suddenly changes.",
    stat: "Instant",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share reports and collaborate with your entire organization.",
    stat: "Unlimited",
  },
];

export default features;