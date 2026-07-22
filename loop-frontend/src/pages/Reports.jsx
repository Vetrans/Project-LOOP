import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";

import ReportsHeader from "../components/reports/ReportsHeader";
import ReportSummaryCards from "../components/reports/ReportSummaryCards";
import ReportFilters from "../components/reports/ReportFilters";
import ReportsTable from "../components/reports/ReportsTable";
import ReportPreview from "../components/reports/ReportPreview";
import ExportModal from "../components/reports/ExportModal";

import {
  getReportSummary,
  getReports,
  exportReport,
} from "../services/reportsService";

import {
  reportTypes,
  reportStatus,
} from "../data/reportsData";

export default function Reports() {
  const [summary, setSummary] = useState([]);
  const [reports, setReports] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);

  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);

    try {
      const summaryData = await getReportSummary();
      const reportsData = await getReports();

      setSummary(summaryData);
      setReports(reportsData);

      if (reportsData.length > 0 && !selectedReport) {
        setSelectedReport(reportsData[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(search.toLowerCase()) ||
        report.createdBy.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === "All" || report.type === type;

      const matchesStatus =
        status === "All" || report.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reports, search, type, status]);

  const clearFilters = () => {
    setSearch("");
    setType("All");
    setStatus("All");
  };

  const handlePreview = (report) => {
    setSelectedReport(report);
  };

  const handleDownload = (report) => {
    console.log("Download:", report);

    alert(
      `Downloading "${report.name}" will work after backend integration.`
    );
  };

  const handleExport = async (format) => {
    await exportReport(format);

    setShowExportModal(false);

    alert(
      `${format.toUpperCase()} export will be available after backend integration.`
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <div className="flex h-[60vh] items-center justify-center text-lg text-gray-400">
            Loading Reports...
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <ReportsHeader
          onRefresh={loadReports}
          onExport={() => setShowExportModal(true)}
        />

        <ReportSummaryCards summary={summary} />

        <ReportFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          status={status}
          setStatus={setStatus}
          reportTypes={reportTypes}
          reportStatus={reportStatus}
          onClear={clearFilters}
        />

        <ReportsTable
          reports={filteredReports}
          onPreview={handlePreview}
          onDownload={handleDownload}
        />

        <ReportPreview report={selectedReport} />

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      </PageContainer>
    </DashboardLayout>
  );
}