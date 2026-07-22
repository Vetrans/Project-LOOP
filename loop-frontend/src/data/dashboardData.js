import {
  MessageSquare,
  Smile,
  TrendingUp,
  Brain,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Package,
  Truck,
  CreditCard,
  Headphones,
  ShieldCheck,
  
} from "lucide-react";


// Additional data for dashboard statistics
export const dashboardStats = [
  {
    title: "Total Feedback",
    value: "24,581",
    change: "+12%",
    icon: MessageSquare,
  },
  {
    title: "Positive",
    value: "82%",
    change: "+5%",
    icon: Smile,
  },
  {
    title: "Growth",
    value: "18%",
    change: "+3%",
    icon: TrendingUp,
  },
  {
    title: "AI Accuracy",
    value: "98%",
    change: "+1%",
    icon: Brain,
  },
];

// Additional data for recent feedback
export const feedbackTrend = [
  { name: "Mon", feedback: 120 },
  { name: "Tue", feedback: 210 },
  { name: "Wed", feedback: 180 },
  { name: "Thu", feedback: 260 },
  { name: "Fri", feedback: 240 },
  { name: "Sat", feedback: 320 },
  { name: "Sun", feedback: 290 },
];

// Additional data for sentiment analysis 
export const sentimentData = [
  { name: "Positive", value: 68 },
  { name: "Neutral", value: 20 },
  { name: "Negative", value: 12 },
];

// Additional data for top themes
export const topThemes = [
  {
    title: "Product Quality",
    count: 452,
    change: "+12%",
    icon: Package,
    color: "text-cyan-400",
  },
  {
    title: "Delivery Delay",
    count: 321,
    change: "+8%",
    icon: Truck,
    color: "text-yellow-400",
  },
  {
    title: "Payment Issues",
    count: 198,
    change: "-4%",
    icon: CreditCard,
    color: "text-red-400",
  },
  {
    title: "Customer Support",
    count: 164,
    change: "+15%",
    icon: Headphones,
    color: "text-green-400",
  },
  {
    title: "Security & Trust",
    count: 96,
    change: "+2%",
    icon: ShieldCheck,
    color: "text-purple-400",
  },
];

// Additional data for recent feedback
export const recentFeedback = [
  {
    customer: "John Smith",
    message: "Delivery was fast and packaging was excellent.",
    sentiment: "Positive",
    category: "Delivery",
    status: "Resolved",
  },
  {
    customer: "Emma Watson",
    message: "Payment failed twice before succeeding.",
    sentiment: "Negative",
    category: "Payment",
    status: "Pending",
  },
  {
    customer: "Rahul Sharma",
    message: "Product quality exceeded my expectations.",
    sentiment: "Positive",
    category: "Product",
    status: "Resolved",
  },
  {
    customer: "Sophia Lee",
    message: "Customer support replied after two days.",
    sentiment: "Neutral",
    category: "Support",
    status: "In Review",
  },
];