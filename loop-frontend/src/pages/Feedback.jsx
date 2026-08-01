import { useEffect, useState } from "react";
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
import { useAuth } from "../context/AuthContext";

const sentimentLabel = { POS: "Positive", NEU: "Neutral", NEG: "Negative" };
const statusLabel = { NEW: "Pending", REVIEWED: "In Review", ACTIONED: "Resolved" };

const LIMIT = 10;
const EXPORT_PAGE_SIZE = 100; // matches the backend's max allowed limit

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

// Builds the query params object shared by both the inbox fetch and the
// "export everything matching the filters" fetch below.
function buildFilterParams(filters) {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.channel) params.channel = filters.channel;
  if (filters.sentiment) params.sentiment = filters.sentiment;
  if (filters.status) params.status = filters.status;
  if (filters.theme) params.theme = filters.theme;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  return params;
}

export default function Feedback() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "ANALYST";

  const [items, setItems] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);

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
      const params = { ...buildFilterParams(filters), page, limit: LIMIT };
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

  useEffect(() => {
    const timer = setTimeout(loadFeedback, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
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

  // Fetches EVERY item matching the active filters (not just the
  // current page) by walking through backend pages at the max page
  // size, then exports the full set. Previously this exported only
  // `items` — the current page's ~10 rows — regardless of how many
  // items actually matched the filters.
  async function handleExport() {
    setExporting(true);
    try {
      const filterParams = buildFilterParams(filters);
      let allItems = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const data = await getFeedback({
          ...filterParams,
          page: currentPage,
          limit: EXPORT_PAGE_SIZE,
        });
        allItems = allItems.concat(data.items.map(present));
        totalPages = data.pages;
        currentPage += 1;
      } while (currentPage <= totalPages);

      if (allItems.length === 0) {
        toast.error("No feedback matches the current filters to export.");
        return;
      }

      exportFeedbackCSV(
        allItems.map((item) => ({
          customer: item.customer,
          feedback: item.feedback,
          category: item.category,
          sentiment: item.sentimentDisplay,
          status: item.statusDisplay,
        })),
      );

      toast.success(
        `Exported ${allItems.length} feedback item${allItems.length === 1 ? "" : "s"}.`,
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not export feedback.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <DashboardLayout>
      <PageContainer title="Feedback Management" subtitle="Manage and analyze customer feedback.">
        <FeedbackHeader
          onAdd={() => setShowAddModal(true)}
          onExport={handleExport}
          exporting={exporting}
          onUpload={() => setShowUploadModal(true)}
          onSimulate={() => setShowSimulateModal(true)}
          canManage={canManage}
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
            canManage={canManage}
          />

          <Pagination
            page={meta.pages > 0 ? Math.min(page, meta.pages) : page}
            pages={meta.pages}
            total={meta.total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </div>

        {canManage && (
          <>
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
          </>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}