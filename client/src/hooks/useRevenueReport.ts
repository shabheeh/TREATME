import { useState, useEffect } from "react";
import revenueReportService from "../services/revenueReport/revenueReportService";
import {
  getRevenueReportQuery,
  RevenueReportData,
  TimeFilter,
} from "../types/revenueReport/revenueReport.types";

const useRevenueReportData = ({
  reportType,
  timeFilter,
  doctorId,
  startDate,
  endDate,
  page,
}: {
  reportType: "all" | "admin" | "doctor";
  timeFilter: TimeFilter;
  doctorId: string | null;
  startDate: string | null;
  endDate: string | null;
  page: number;
}) => {
  const [revenueData, setRevenueData] = useState<RevenueReportData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const query: getRevenueReportQuery = {
        timeFilter,
        page: page,
      };

      if (startDate && endDate) {
        query.startDate = startDate;
        query.endDate = endDate;
      }

      if (doctorId) {
        query.doctorId = doctorId;
      }

      const response = await revenueReportService.getRevenueReport(query);
      setRevenueData(response);
    } catch (err) {
      setError(
        (err instanceof Error && err.message) ||
          "Failed to fetch revenue report"
      );
      console.error("Error fetching revenue report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType === "admin" || reportType === "doctor") {
      fetchRevenueReport();
    } else {
      setRevenueData(null);
      setError(null);
    }
  }, [reportType, timeFilter, doctorId, startDate, endDate, page]);

  const getCurrentData = () => {
    if (revenueData) {
      return {
        transactions: revenueData.transactions || [],
        summary: revenueData.summary,
        pagination: revenueData.pagination,
        dateRange: revenueData.dateRange,
      };
    }
    return {
      transactions: [],
      summary: null,
      pagination: null,
      dateRange: null,
    };
  };

  const refreshData = () => {
    if (reportType === "admin" || reportType === "doctor") {
      fetchRevenueReport();
    }
  };

  return {
    currentData: getCurrentData(),
    revenueData,
    loading,
    error,
    refreshData,
    setError,
  };
};

export default useRevenueReportData;
