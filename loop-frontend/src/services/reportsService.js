import {
  reportSummary,
  reports,
  reportPreview,
} from "../data/reportsData";

/*
=========================================
Reports Service

Only this file will communicate
with the backend.

When backend is ready,
replace these mock functions
with axios API calls.
=========================================
*/

export const getReportSummary = async () => {
  return reportSummary;
};

export const getReports = async () => {
  return reports;
};

export const getReportPreview = async () => {
  return reportPreview;
};

export const exportReport = async (type) => {
  /*
      Future API

      GET /api/reports/export?type=pdf
  */

  console.log("Export:", type);

  return true;
};