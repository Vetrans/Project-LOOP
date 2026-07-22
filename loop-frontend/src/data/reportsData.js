export const reportSummary = [
  {
    id: 1,
    title: "Total Reports",
    value: "245",
    change: "+18%",
    trend: "up",
  },
  {
    id: 2,
    title: "Generated Today",
    value: "18",
    change: "+5%",
    trend: "up",
  },
  {
    id: 3,
    title: "Scheduled Reports",
    value: "12",
    change: "+2%",
    trend: "up",
  },
  {
    id: 4,
    title: "Export Success",
    value: "99.4%",
    change: "+0.8%",
    trend: "up",
  },
];

export const reports = [
  {
    id: 1,
    name: "Monthly Feedback Analysis",
    type: "PDF",
    createdBy: "Admin",
    date: "2026-07-18",
    status: "Completed",
  },
  {
    id: 2,
    name: "Customer Sentiment Report",
    type: "Excel",
    createdBy: "AI Engine",
    date: "2026-07-19",
    status: "Completed",
  },
  {
    id: 3,
    name: "Complaint Trends",
    type: "CSV",
    createdBy: "Manager",
    date: "2026-07-20",
    status: "Generating",
  },
];

export const reportPreview = {
  title: "Monthly Feedback Summary",
  summary:
    "Customer satisfaction increased by 9%. Delivery issues reduced significantly while packaging remains the primary concern.",
};

export const reportTypes = [
  "All",
  "PDF",
  "Excel",
  "CSV",
];

export const reportStatus = [
  "All",
  "Completed",
  "Generating",
  "Failed",
];