import { useState, useEffect } from "react";
import revenueReportService from "../services/revenueReport/revenueReportService";
import {
  AllDoctorsRevenueResponse,
  getRevenueReportQuery,
  TimeFilter,
} from "../types/revenueReport/revenueReport.types";

const useDoctorsRevenueSummary = ({
  reportType,
  timeFilter,
  startDate,
  endDate,
  page,
}: {
  reportType: "all" | "admin" | "doctor";
  timeFilter: TimeFilter;
  startDate: string | null;
  endDate: string | null;
  page: number;
}) => {
  const [doctorsData, setDoctorsData] =
    useState<AllDoctorsRevenueResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctorsRevenueSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const query: getRevenueReportQuery = {
        timeFilter,
        page,
      };

      if (startDate && endDate) {
        query.startDate = startDate;
        query.endDate = endDate;
      }

      const response =
        await revenueReportService.getAllDoctorsRevenueSummary(query);
      setDoctorsData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch doctors revenue summary"
      );
      console.error("Error fetching doctors revenue summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType === "all") {
      fetchDoctorsRevenueSummary();
    } else {
      setDoctorsData(null);
      setError(null);
    }
  }, [reportType, timeFilter, startDate, endDate, page]);

  const getCurrentData = () => {
    if (doctorsData) {
      return {
        doctors: doctorsData.doctors,
        summary: doctorsData.totalSummary,
        pagination: doctorsData.pagination,
      };
    }
    return {
      doctors: [],
      summary: null,
      pagination: null,
    };
  };

  const refreshData = () => {
    if (reportType === "all") {
      fetchDoctorsRevenueSummary();
    }
  };

  return {
    currentData: getCurrentData(),
    doctorsData,
    loading,
    error,
    refreshData,
    setError,
  };
};

export default useDoctorsRevenueSummary;
