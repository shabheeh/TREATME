import { useState } from "react";
import revenueReportService from "../services/revenueReport/revenueReportService";
import { getRevenueReportQuery } from "../types/revenueReport/revenueReport.types";

export const useRevenueReportPdf = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPdf = async (query: getRevenueReportQuery) => {
    setLoading(true);
    setError(null);

    try {
      await revenueReportService.downloadRevenueReportPdf(query);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to download revenue report PDF";
      setError(errorMessage);
      console.error("Error downloading revenue report PDF:", err);
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
