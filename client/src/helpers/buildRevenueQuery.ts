import { getRevenueReportQuery } from "../types/revenueReport/revenueReport.types";

export const buildQueryParams = (query: getRevenueReportQuery) => {
  const params = new URLSearchParams();

  if (query.startDate) params.append("startDate", query.startDate);
  if (query.endDate) params.append("endDate", query.endDate);
  if (query.timeFilter) params.append("timeFilter", query.timeFilter);
  if (query.doctorId) params.append("doctorId", query.doctorId);
  if (query.page) params.append("page", query.page.toString());

  return params.toString();
};
