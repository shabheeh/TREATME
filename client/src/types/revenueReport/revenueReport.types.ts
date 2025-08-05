export type TimeFilter = "monthly" | "weekly" | "yearly" | "custom";

export interface getRevenueReportQuery {
  startDate?: string;
  endDate?: string;
  timeFilter: TimeFilter;
  doctorId?: string;
  page: number;
}

export type ReportType = "all" | "admin" | "doctor";

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
