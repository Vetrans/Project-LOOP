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
import Pagination from "../components/common/Pagination";
import { exportFeedbackCSV } from "../utils/exportCSV";
import {
  addFeedback,
  getFeedback,
  updateFeedbackStatus,
  simulateChannel,
} from "../services/feedbackService";
import { getThemes } from "../services/themeService";

const sentimentLabel = { POS: "Positive", NEU: "Neutral", NEG: "Negative" };
const statusLabel = { NEW: "Pending", REVIEWED: "In Review", ACTIONED: "Resolved" };

const LIMIT = 10;

const emptyFilters = {
  search: "",
  channel: "",
  sentiment: "",
  status: "",
  theme: "",
  startDate: "",
  endDate: "",
};

// Keeps raw enum codes (sentiment/status) intact for filtering/editing,
// while still exposing display labels for the table.
function present(item) {
  return {
    id: item._id,
    customer: item.customerLabel || "Anonymous",
    feedback: item.content,
    channel: item.channel,
    sentiment: item.sentiment,
    sentimentDisplay: sentimentLabel[item.sentiment] || item.sentiment,
    category: item.featureArea || "General",
    status: item.status,
    statusDisplay: statusLabel[item.status] || item.status,
  };
}

export default function Feedback() {
  const [items, setItems] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  // Themes only need to load once (and after a simulate/add, since new
  // items may introduce new themes) — kept separate from the debounced
  // feedback-list effect below.
  async function loadThemes() {
    try {
      const data = await getThemes();
      setThemes(data);
    } catch {
      // Non-fatal — the theme filter dropdown just stays empty.
    }
  }

  async function loadFeedback() {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filters.search) params.search = filters.search;
      if (filters.channel) params.channel = filters.channel;
      if (filters.sentiment) params.sentiment = filters.sentiment;
      if (filters.status) params.status = filters.status;
      if (filters.theme) params.theme = filters.theme;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const data = await getFeedback(params);
      setItems(data.items.map(present));
      setMeta({ total: data.total, pages: data.pages });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load feedback.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadThemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced so typing in the search box (or flipping several filters
  // in quick succession) doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(loadFeedback, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // any filter change restarts pagination at page 1
  }

  function clearFilters() {
    setFilters(emptyFilters);
    setPage(1);
  }

  async function handleCreate(form) {
    try {
      await addFeedback(form);
      toast.success("Feedback added and classified by AI.");
      setShowAddModal(false);
      loadFeedback();
      loadThemes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add feedback.");
    }
  }

  async function handleSimulate(channel, count) {
    const result = await simulateChannel(channel, count);
    loadFeedback();
    loadThemes();
    return result;
  }

  // Optimistic: the dropdown updates instantly, then confirms with the
  // server; on failure it reverts so the UI never lies about state.
  async function handleStatusChange(id, newStatus) {
    const previous = items;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus, statusDisplay: statusLabel[newStatus] }
          : item,
      ),
    );

    try {
      await updateFeedbackStatus(id, newStatus);
    } catch (error) {
      setItems(previous);
      toast.error(error.response?.data?.message || "Could not update status.");
    }
  }

  // What's currently on screen is already exactly what the filters
  // describe (server-side), so export just ships the current page as-is.
  const exportRows = useMemo(
    () =>
      items.map((item) => ({
        customer: item.customer,
        feedback: item.feedback,
        category: item.category,
        sentiment: item.sentimentDisplay,
        status: item.statusDisplay,
      })),
    [items],
  );

  return (
    <DashboardLayout>
      <PageContainer title="Feedback Management" subtitle="Manage and analyze customer feedback.">
        <FeedbackHeader
          onAdd={() => setShowAddModal(true)}
          onExport={() => exportFeedbackCSV(exportRows)}
          onUpload={() => setShowUploadModal(true)}
          onSimulate={() => setShowSimulateModal(true)}
        />

        <FeedbackFilters
          filters={filters}
          onChange={updateFilter}
          themes={themes}
          onClear={clearFilters}
        />

        <div className="mt-6">
          <FeedbackTable
            feedback={items}
            onStatusChange={handleStatusChange}
            loading={loading}
          />

          <Pagination
            page={meta.pages > 0 ? Math.min(page, meta.pages) : page}
            pages={meta.pages}
            total={meta.total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </div>

        <AddFeedbackModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleCreate}
        />

        <UploadCSV
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            loadFeedback();
            loadThemes();
          }}
        />

        <SimulateChannelModal
          open={showSimulateModal}
          onClose={() => setShowSimulateModal(false)}
          onSimulate={handleSimulate}
        />
      </PageContainer>
    </DashboardLayout>
  );
}