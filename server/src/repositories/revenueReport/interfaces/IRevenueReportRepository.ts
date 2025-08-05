export interface DetailedRevenueData {
  appointmentId: string;
  date: Date;
  time: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  consultationFee: number;
  platformCommission: number;
  doctorEarning: number;
  status: string;
  specialization: string;
}

export interface RevenueSummary {
  totalFees: number;
  totalCommission: number;
  totalDoctorEarnings: number;
  appointmentCount: number;
  averageFeePerConsultation: number;
}

export interface Pagination {
  page: number;
  count: number;
  totalPages: number;
}

export interface RevenueReportData {
  summary: RevenueSummary;
  transactions: DetailedRevenueData[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  pagination: Pagination;
}

export interface DoctorRevenueSummary {
  doctorId: string;
  doctorName: string;
  specialization: string;
  totalEarnings: number;
  totalAppointments: number;
  averageEarningPerConsultation: number;
}

export interface AllDoctorsRevenueResponse {
  doctors: DoctorRevenueSummary[];
  totalSummary: RevenueSummary;
  pagination: Pagination;
}

export interface DailyRevenueBreakdown {
  date: string;
  revenue: number;
  appointmentCount: number;
  averageFee: number;
}

export interface RevenueExportData {
  summary: RevenueSummary;
  transactions: DetailedRevenueData[];
  metadata: {
    reportType: string;
    dateRange: string;
    generatedAt: Date;
    totalPages: number;
  };
}

export interface DoctorAggregationResult extends DoctorRevenueSummary {
  totalFees: number;
  totalCommission: number;
}

export type ReportType = "admin" | "doctor";
export type TimeFilter = "weekly" | "monthly" | "yearly" | "custom";

export interface IRevenueReportRepository {
  getRevenueReport(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter,
    page: number,
    getAllData: boolean,
    doctorId?: string
  ): Promise<RevenueReportData>;

  getAllDoctorsRevenueSummary(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter,
    page: number,
    getAllData: boolean
  ): Promise<AllDoctorsRevenueResponse>;

  // getDailyRevenueBreakdown(
  //   startDate: Date,
  //   endDate: Date,
  //   doctorId?: string
  // ): Promise<DailyRevenueBreakdown[]>;

  // getTopEarningDoctors(
  //   startDate: Date,
  //   endDate: Date,
  //   limit: number
  // ): Promise<DoctorRevenueSummary[]>;

  // exportRevenueData(
  //   reportType: "admin" | "doctor" | "all",
  //   startDate: Date,
  //   endDate: Date,
  //   doctorId?: string
  // ): Promise<RevenueExportData>;
}
