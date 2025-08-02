import {
  DetailedRevenueData,
  RevenueSummary,
} from "src/repositories/revenueReport/interfaces/IRevenueReportRepository";

export const calculateSummary = (
  transactions: DetailedRevenueData[]
): RevenueSummary => {
  const totalFees = transactions.reduce(
    (sum, transaction) => sum + transaction.consultationFee,
    0
  );
  const totalCommission = transactions.reduce(
    (sum, transaction) => sum + transaction.platformCommission,
    0
  );
  const totalDoctorEarnings = transactions.reduce(
    (sum, transaction) => sum + transaction.doctorEarning,
    0
  );

  return {
    totalFees,
    totalCommission,
    totalDoctorEarnings,
    appointmentCount: transactions.length,
    averageFeePerConsultation:
      transactions.length > 0 ? totalFees / transactions.length : 0,
  };
};
