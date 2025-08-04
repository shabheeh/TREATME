import { useState } from "react";
import { getRevenueReportQuery } from "../types/revenueReport/revenueReport.types";
import revenueReportService from "../services/revenueReport/revenueReportService";

export const useDoctorsSummaryPdf = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPdf = async (query: getRevenueReportQuery) => {
    setLoading(true);
    setError(null);

    try {
      await revenueReportService.downloadDoctorsSummaryPdf(query);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to download doctors summary PDF";
      setError(errorMessage);
      console.error("Error downloading doctors summary PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    downloadPdf,
    loading,
    error,
    clearError: () => setError(null),
  };
};
