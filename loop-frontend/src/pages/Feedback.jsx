import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";
import FeedbackHeader from "../components/feedback/FeedbackHeader";
import FeedbackFilters from "../components/feedback/FeedbackFilters";
import FeedbackTable from "../components/feedback/FeedbackTable";
import AddFeedbackModal from "../components/feedback/AddFeedbackModal";
import UploadCSV from "../components/feedback/UploadCSV";
import SimulateChannelModal from "../components/feedback/SimulateChannelModal";
import { exportFeedbackCSV } from "../utils/exportCSV";
import {
  addFeedback,
  getFeedback,
  simulateChannel,
} from "../services/feedbackService";

const sentimentLabel = { POS: "Positive", NEU: "Neutral", NEG: "Negative" };
const statusLabel = { NEW: "Pending", REVIEWED: "In Review", ACTIONED: "Resolved" };

function present(item) {
  return {
    id: item._id,
    customer: item.customerLabel || "Anonymous",
    feedback: item.content,
    sentiment: sentimentLabel[item.sentiment] || item.sentiment,
    category: item.featureArea || "General",
    status: statusLabel[item.status] || item.status,
  };
}

export default function Feedback() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentiment, setSentiment] = useState("All Sentiments");
  const [category, setCategory] = useState("All Categories");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  async function loadFeedback() {
    try {
      const data = await getFeedback({ limit: 100 });
      setItems(data.items.map(present));
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load feedback.");
    }
  }
  useEffect(() => { loadFeedback(); }, []);

  const filteredFeedback = useMemo(() => items.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (item.customer.toLowerCase().includes(search) || item.feedback.toLowerCase().includes(search))
      && (sentiment === "All Sentiments" || item.sentiment === sentiment)
      && (category === "All Categories" || item.category === category);
  }), [items, searchTerm, sentiment, category]);

  async function handleCreate(form) {
    try {
      await addFeedback(form);
      toast.success("Feedback added and classified by AI.");
      setShowAddModal(false);
      loadFeedback();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add feedback.");
    }
  }

  // Passed straight to SimulateChannelModal, which shows its own
  // toast/loading state and expects the raw response back so it can
  // report exactly how many items were created.
  async function handleSimulate(channel, count) {
    const result = await simulateChannel(channel, count);
    loadFeedback();
    return result;
  }

  return <DashboardLayout><PageContainer title="Feedback Management" subtitle="Manage and analyze customer feedback.">
    <FeedbackHeader
      onAdd={() => setShowAddModal(true)}
      onExport={() => exportFeedbackCSV(filteredFeedback)}
      onUpload={() => setShowUploadModal(true)}
      onSimulate={() => setShowSimulateModal(true)}
    />
    <FeedbackFilters {...{ searchTerm, setSearchTerm, sentiment, setSentiment, category, setCategory }} />
    <div className="mt-6"><FeedbackTable feedback={filteredFeedback} /></div>

    <AddFeedbackModal
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
      onSave={handleCreate}
    />

    <UploadCSV
      open={showUploadModal}
      onClose={() => setShowUploadModal(false)}
      onSuccess={loadFeedback}
    />

    <SimulateChannelModal
      open={showSimulateModal}
      onClose={() => setShowSimulateModal(false)}
      onSimulate={handleSimulate}
    />
  </PageContainer></DashboardLayout>;
}