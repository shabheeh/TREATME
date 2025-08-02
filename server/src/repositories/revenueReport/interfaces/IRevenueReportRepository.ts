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

export interface RevenueReportData {
  summary: RevenueSummary;
  transactions: DetailedRevenueData[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  pagination: {
    page: number;
    count: number;
    totalPages: number;
  };
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
  pagination: {
    page: number;
    count: number;
    totalPages: number;
  };
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

export interface IRevenueReportRepository {
  getRevenueReport(
    startDate: Date,
    endDate: Date,
    timeFilter: "weekly" | "monthly" | "yearly" | "custom",
    page: number,
    doctorId?: string
  ): Promise<RevenueReportData>;

  getAllDoctorsRevenueSummary(
    startDate: Date,
    endDate: Date,
    timeFilter: "weekly" | "monthly" | "yearly" | "custom",
    page: number
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
